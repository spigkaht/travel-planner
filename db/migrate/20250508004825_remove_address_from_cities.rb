class RemoveAddressFromCities < ActiveRecord::Migration[7.1]
  def change
    remove_column :cities, :address
  end
end
