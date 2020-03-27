require 'test_helper'

class CalculatorControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get calculator_show_url
    assert_response :success
  end

end
