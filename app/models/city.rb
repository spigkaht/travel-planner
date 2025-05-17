class City < ApplicationRecord
  validates :name, :country, presence: true

  has_many :city_trips
  has_many :trips, through: :city_trips

  def address
    "#{name}, #{country}"
  end

  geocoded_by :address
  after_validation :geocode
end
