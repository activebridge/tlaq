# Frozen-string-literal: true
# Asset pipeline plugin providing digest-based fingerprinting for CSS, JS, and fonts.
# Provides {% asset %} Liquid tag with @path modifier for fingerprinted URLs.

require "digest"
require "fileutils"

module Jekyll
  module AssetPipeline
    ASSET_DIRS = %w[_assets/css _assets/js _assets/fonts].freeze
    DIGEST_LENGTH = 12

    def self.digest_for(content)
      Digest::SHA256.hexdigest(content)[0, DIGEST_LENGTH]
    end

    def self.fingerprinted_name(filename, digest)
      dir = File.dirname(filename)
      ext = File.extname(filename)
      base = File.basename(filename, ext)
      name = "#{base}-#{digest}#{ext}"
      dir == "." ? name : File.join(dir, name)
    end

    # Build the manifest mapping logical paths to fingerprinted output paths
    def self.build_manifest(site)
      manifest = {}

      # First pass: collect all files and compute digests
      ASSET_DIRS.each do |dir|
        full_dir = File.join(site.source, dir)
        next unless File.directory?(full_dir)

        Dir.glob(File.join(full_dir, "**", "*")).each do |file|
          next if File.directory?(file)
          relative = file.sub("#{full_dir}/", "")
          content = File.binread(file)
          digest = digest_for(content)
          fingerprinted = fingerprinted_name(relative, digest)
          manifest[relative] = {
            source: file,
            fingerprinted: fingerprinted,
            digest: digest,
          }
        end
      end

      # Second pass: rewrite url() references in CSS files
      manifest.each do |logical_path, entry|
        next unless logical_path.end_with?(".css")

        content = File.read(entry[:source])
        rewritten = content.gsub(/url\(["']?([^"')]+\.woff2)["']?\)/) do |match|
          ref = Regexp.last_match(1)
          basename = File.basename(ref)
          font_entry = manifest[basename]
          if font_entry
            "url(\"#{font_entry[:fingerprinted]}\")"
          else
            match
          end
        end

        if rewritten != content
          # Recompute digest with rewritten content
          new_digest = digest_for(rewritten)
          entry[:fingerprinted] = fingerprinted_name(logical_path, new_digest)
          entry[:digest] = new_digest
          entry[:rewritten_content] = rewritten
        end
      end

      manifest
    end

    class AssetTag < Liquid::Tag
      PATH_MODIFIER = "@path".freeze

      def initialize(tag_name, markup, tokens)
        super
        parts = markup.strip.split(/\s+/)
        @asset_name = parts[0]
        @path_only = parts.include?(PATH_MODIFIER)
      end

      def render(context)
        site = context.registers[:site]
        manifest = site.data["_asset_manifest"] ||= AssetPipeline.build_manifest(site)
        entry = manifest[@asset_name]

        unless entry
          Jekyll.logger.error "Asset Pipeline:", "Asset not found: #{@asset_name}"
          return ""
        end

        output_path = "/assets/#{entry[:fingerprinted]}"

        if @path_only
          output_path
        else
          ext = File.extname(@asset_name).downcase
          case ext
          when ".css"
            %(<link rel="stylesheet" href="#{output_path}">)
          when ".js"
            %(<script src="#{output_path}"></script>)
          else
            output_path
          end
        end
      end
    end

    class Generator < Jekyll::Generator
      safe true
      priority :low

      def generate(site)
        manifest = AssetPipeline.build_manifest(site)
        site.data["_asset_manifest"] = manifest

        manifest.each do |_logical_path, entry|
          dest_path = "assets/#{entry[:fingerprinted]}"
          site.static_files << AssetFile.new(
            site, entry[:source], dest_path,
            content: entry[:rewritten_content]
          )
        end
      end
    end

    class AssetFile < Jekyll::StaticFile
      def initialize(site, source_path, dest_path, content: nil)
        @source_path = source_path
        @dest_path = dest_path
        @custom_content = content
        @site = site
        super(site, File.dirname(source_path), "", File.basename(source_path))
      end

      def destination(dest)
        File.join(dest, @dest_path)
      end

      def write(dest)
        dest_path = destination(dest)
        FileUtils.mkdir_p(File.dirname(dest_path))
        if @custom_content
          File.write(dest_path, @custom_content)
        else
          FileUtils.cp(@source_path, dest_path)
        end
        true
      end
    end
  end
end

Liquid::Template.register_tag("asset", Jekyll::AssetPipeline::AssetTag)
