class Api::ReminderController < ApplicationController
  before_action :verify_auth
  before_action :reminder, only: [:show, :update, :destroy]

  def index
    @reminders = Reminder.where(user_id: current_user.id, status: 1)
    render json: { data: @reminders }
  end
  
  def show
    if @reminder.empty?
      render json: { error: 'No permission to show reminder id'}, status: :forbidden
    else
      render json: { data: @reminder }
    end
  end

  def create
    new_reminder = Reminder.new(reminer_params.merge(user_id: current_user.id))
    if new_reminder.save
      render json:{ success: new_reminder}, status: :created
    else
      render json:{error: new_reminder.errors}, status: :forbidden
    end
  end
  
  def update
    if @reminder.empty?
      render json: { error: 'No permission to update reminder id' }, status: :forbidden
    else
      if @reminder.update(reminer_params)
        render json: { success: @reminder }
      else
        render json: { error: @reminder.errors }, status: :unprocessable_entity
      end
    end
  end
  
  def destroy
    if @reminder.empty?
        render json: { error: 'No permission to destroy reminder id'}, status: :forbidden
    else
      if @reminder.update(status: 0)
          render json: { success: 'Reminder successfully destroy'}
      else
          render json: { error: @reminder.errors}, status: :unprocessable_entity
      end
    end
  end

  private
  
  def verify_auth
      if !current_user
          render json: { error: 'Unauthorized'}, status: :forbidden
      end
  end
  
  def reminer_params
      params.require(:reminder).permit(:text, :color, :startDate, :endDate)
  end

  def reminder
      @reminder = Reminder.where(user_id: current_user.id, id: params[:id], status: 1)
  end

end
