require 'test_helper'

class CalculateControllerTest < ActionDispatch::IntegrationTest
  test "should get evaluate" do
    get calculate_evaluate_url
    assert_response :success
  end

end
