class Api::CalculateController < ApplicationController
  before_action :check_if_formula_present

  def evaluate
    result = Fractify::Calculator.evaluate(params[:formula].to_s)
    if result
      response = {
        formula: params[:formula],
        result: result.to_s
      }
      render json: response.to_json, status: 200
    else
      response = { error: 'Incorrect syntax!', formula: params[:formula] }
      render json: response.to_json, status: 422
    end
  end

  private

  def check_if_formula_present
    unless params[:formula]
      response = { error: 'Wrong arguments!', formula: params[:formula] }
      render json: response.to_json, status: 400
    end
  end
end
