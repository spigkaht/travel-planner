class CreateCityTrips < ActiveRecord::Migration[7.1]
  def change
    create_table :city_trips do |t|
      t.references :city, null: false, foreign_key: true
      t.references :trip, null: false, foreign_key: true

      t.timestamps
    end
  end
end
