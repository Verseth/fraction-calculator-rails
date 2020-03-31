source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

gem 'bootstrap'
gem 'coffee-rails', '~> 4.2'
gem 'font-awesome-sass', '~> 5.12.0'
gem 'fractify', '> 1.0'
gem 'haml'
gem 'haml-rails'
gem 'jbuilder', '~> 2.5'
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'popper_js'
gem 'puma', '~> 3.7'
gem 'rails', '~> 5.1.7'
gem 'sass-rails', '~> 5.0'
gem 'tether-rails'
gem 'turbolinks', '~> 5'

group :development do
  gem 'better_errors'
  gem 'byebug'
  gem 'capistrano-rails'
  gem 'listen'
  gem 'rubocop'
  gem 'rvm'
  gem 'rvm-capistrano', require: false
  gem 'web-console', '>= 3.3.0'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen'
end

group :test do
  gem 'capybara', '>= 2.15'
  gem 'minitest'
  gem 'minitest-reporters'
  gem 'rspec-rails'
  gem 'rubocop-rspec', require: false
  gem 'selenium-webdriver'
  gem 'simplecov', require: false
end
