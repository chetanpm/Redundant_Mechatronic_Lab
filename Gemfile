# Modern GitHub Pages setup (build source: GitHub Actions — see
# .github/workflows/jekyll.yml). GitHub's frozen `github-pages` metagem
# (v232, Jekyll 3.10, last release Aug 2024) is no longer the way to get a
# current Jekyll, so this site depends on jekyll 4.x directly.
#
# Updates: Dependabot (.github/dependabot.yml) opens a PR whenever a gem
# rolls out. Every PR runs .github/workflows/checks.yml (strict build +
# site checks) — a breaking bump shows up as a RED check on the PR.
# Do not merge red PRs; optionally make "Checks" a required status check.
#
# Versions as of 2026-10-02 (jekyll 4.4.1, feed 0.18.0, sitemap 1.4.0,
# seo-tag 2.9.1, paginate 1.1.0).
#
# Parity with the deployed site: the Gemfile.lock is committed and CI runs
# with BUNDLE_FROZEN, so the site deploys EXACTLY the locked tree — nothing
# re-resolves between local and GitHub. (For reference, GitHub's frozen
# branch-build set is listed at https://pages.github.com/versions.json —
# as of 2026-10-02: jekyll 3.10.0, ruby 3.3.4, github-pages 232, feed
# 0.17.0, seo-tag 2.8.0, kramdown 2.4.0. Only relevant if the Pages source
# is ever switched back from "GitHub Actions" to a branch.)

source "https://rubygems.org"

# The Ruby version comes from .ruby-version (3.4) — read by
# ruby/setup-ruby in CI and by rbenv etc. locally. No `ruby` line here
# (a bare "3.4" is treated as an exact 3.4.0 pin, which breaks on 3.4.x).

gem "jekyll", "~> 4.4"

# Plugins used by _config.yml (paginate is a default gem of jekyll; listed
# explicitly so it stays visible and pinned)
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.18"
  gem "jekyll-paginate", "~> 1.1"
  gem "jekyll-seo-tag", "~> 2.9"
  gem "jekyll-sitemap", "~> 1.4"
end
