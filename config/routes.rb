Rails.application.routes.draw do
  devise_for :users
  root to: "pages#index"

  get "/planner", to: "pages#planner", as: "planner"
  resources :cities, only: [:index, :show, :new, :create]

  get "up" => "rails/health#show", as: :rails_health_check
end
