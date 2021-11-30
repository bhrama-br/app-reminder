class Reminder < ApplicationRecord
  belongs_to :user
  before_update :validate_date
  before_save :validate_date
  validates :color, :startDate, :endDate, presence: true
  validates :text, length: { maximum: 30 }, presence: true

  private

  def validate_date
    isValid = (startDate > endDate)

    if isValid
      errors.add(:endDate, 'must be after start date')
      throw :abort
    end
  end
end
