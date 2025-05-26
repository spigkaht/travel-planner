class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]

  def index
  end

  def planner
    @trip = Trip.first
    @cities = City.order(:order)

    if @cities
      @markers = @cities.geocoded.map do |city|
        {
          id: city.id,
          lat: city.latitude,
          lng: city.longitude,
          info_window_html: render_to_string(partial: "shared/info_window", locals: {city: city})
        }
      end
    end
  end

  def sort
    params[:order].each_with_index do |id, index|
      City.where(id: id).update_all(order: index + 1)
    end

    head :ok
  end
end
