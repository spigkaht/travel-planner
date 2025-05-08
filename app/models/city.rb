class City < ApplicationRecord
  validates :name, :country, presence: true

  def address
    "#{name}, #{country}"
  end

  geocoded_by :address
  after_validation :geocode
end
