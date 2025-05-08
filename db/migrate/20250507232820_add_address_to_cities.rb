class AddAddressToCities < ActiveRecord::Migration[7.1]
  def change
    add_column :cities, :address, :string
  end
end
