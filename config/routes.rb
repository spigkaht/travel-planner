Rails.application.routes.draw do
  devise_for :users
  root to: "pages#index"

  get "/planner", to: "pages#planner", as: "planner"
  resources :cities, only: [:index, :show, :new, :create] do
    collection do
      patch :sort
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
