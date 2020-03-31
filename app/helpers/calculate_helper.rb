module CalculateHelper
  def special(string)
    capture_haml {
      haml_tag 'span.special-text', string
    }.strip!.html_safe
  end

  def bold(string)
    capture_haml {
      haml_tag 'span.bold', string
    }.strip!.html_safe
  end
end
