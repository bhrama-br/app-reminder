FactoryBot.define do
  factory :reminder do
    sequence(:text) { |n| "Text test #{n}"}
    startDate { Time.current }
    endDate { Time.current + 5.hour }
    color { '#fff' }
  end
end
