class CreateReminders < ActiveRecord::Migration[6.1]
  def change
    create_table :reminders do |t|
      t.string :text
      t.datetime :startDate
      t.datetime :endDate
      t.string :color
      t.boolean :status, :default => true
      t.references :user, index: true
      t.timestamps
    end
  end
end
