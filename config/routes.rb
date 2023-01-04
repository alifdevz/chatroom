Rails.application.routes.draw do
  # Action cable server
  mount ActionCable.server => '/cable'
  resources :messages
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
