class CitiesController < ApplicationController
  before_action :set_city, only: [:show, :edit, :update, :destroy]

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

  def edit
  end

  def update
    @city.update(city_params)
    redirect_to planner_path
  end

  def destroy
    @city.destroy
    redirect_to planner_path, status: :see_other
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

  def set_city
    @city = City.find(params[:id])
  end
end
