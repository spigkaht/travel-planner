class Trip < ApplicationRecord
  has_many :city_trips
  has_many :cities, through: :city_trips
end
