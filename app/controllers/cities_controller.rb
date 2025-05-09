class CitiesController < ApplicationController
  def index
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

  def show
    @city = City.find(params[:id])
  end

  def new
    @city = City.new
  end

  def create
    @city = City.new(city_params)
    @city.save

    respond_to do |format|
      if @city.save
        format.html { redirect_to cities_path, notice: "City was successfully created." }
        format.json { render json: @city, status: :created }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @city.errors, status: :unprocessable_entity }
      end
    end
  end

  def sort
    params[:order].each_with_index do |id, index|
      City.where(id: id).update_all(order: index + 1)
    end

    head :ok
  end

  private

  def city_params
    params.require(:city).permit(:name, :country, :longitude, :latitude, :order)
  end
end
