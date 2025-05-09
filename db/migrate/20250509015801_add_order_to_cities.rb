class AddOrderToCities < ActiveRecord::Migration[7.1]
  def change
    add_column :cities, :order, :integer
  end
end
