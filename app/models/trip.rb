class Trip < ApplicationRecord
  has_many :city_trips
  has_many :cities, through: :city_trips

  has_many :user_trips
  has_many :users, through: :user_trips
end
