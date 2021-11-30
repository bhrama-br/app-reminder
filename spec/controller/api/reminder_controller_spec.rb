require 'rails_helper'

RSpec.describe Api::ReminderController, type: :request do
  describe 'GET /api/reminder' do
    it "Returns http success" do
      user = User.create(email: "test@test.com", password:'123123', password_confirmation: '123123')
      sign_in user
      
      5.times { create(:reminder, user_id: user.id) }

      get(api_reminder_index_path)

      expect(response).to have_http_status(:success)
    end

    it "Returns JSON body response containing all available" do
      user = User.create(email: "test@test.com", password:'123123', password_confirmation: '123123')
      sign_in user

      5.times { create(:reminder, user_id: user.id) }

      get(api_reminder_index_path)

      json_response = JSON.parse(response.body)

      expect(json_response['data'].size).to eq(5)
    end
  end

  describe 'GET /api/reminder/:id' do
    it "Shows reminder user by id reminder" do
      user = User.create(email: "test@test.com", password:'123123', password_confirmation: '123123')
      sign_in user

      reminder = create(:reminder, user_id: user.id)

      get(api_reminder_path(reminder))

      expect(response).to have_http_status(:success)
    end

    it "Doesn't show the reminder when the user is not owner" do
      user = User.create(email: "test@test.com", password:'123123', password_confirmation: '123123')
      reminder = create(:reminder, user_id: user.id)

      user = User.create(email: "test2@test.com", password:'123123', password_confirmation: '123123')

      sign_in user

      get(api_reminder_path(reminder))

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe 'DELETE /api/reminder/:id' do
    it "Deletes the reminder" do
      user = User.create(email: "test@test.com", password:'123123', password_confirmation: '123123')
      sign_in user

      reminder = create(:reminder, user_id: user.id)

      delete(api_reminder_path(reminder))

      expect(response).to have_http_status(:success)
    end

    it "Doesn't delete the reminder when the user is not owner" do
      user = User.create(email: "test@test.com", password:'123123', password_confirmation: '123123')
      reminder = create(:reminder, user_id: user.id)

      user = User.create(email: "test2@test.com", password:'123123', password_confirmation: '123123')

      sign_in user

      delete(api_reminder_path(reminder))

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe 'PUT /api/reminder/:id' do
    it 'Updates the reminder' do
      user = User.create(email: "test@test.com", password:'123123', password_confirmation: '123123')
      sign_in user

      reminder = create(:reminder, user_id: user.id)

      put(api_reminder_path(reminder, reminder: { text: 'xx2', startDate: Time.current, endDate: Time.current + 5.hour, color: '#fff' }))

      expect(response).to have_http_status(:success)
    end

    it "Doesn't update the reminder when the user is not owner" do
      user = User.create(email: "test@test.com", password:'123123', password_confirmation: '123123')
      reminder = create(:reminder, user_id: user.id)

      user = User.create(email: "test2@test.com", password:'123123', password_confirmation: '123123')

      sign_in user

      put(api_reminder_path(reminder, reminder: { text: 'xx2', startDate: Time.current, endDate: Time.current + 5.hour, color: '#fff' }))

      expect(response).to have_http_status(:forbidden)
    end
  end
end
