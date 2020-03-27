Rails.application.routes.draw do
  root to: 'calculator#show'

  namespace :api do
    post 'evaluate' => 'calculate#evaluate'
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
