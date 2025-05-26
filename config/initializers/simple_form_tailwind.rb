SimpleForm.setup do |config|
  config.default_wrapper = :tailwind_form

  config.wrappers :tailwind_form, tag: "div", class: "mb-5 pr-4 flex justify-between items-center", error_class: "" do |b|
    b.use :html5
    b.use :label, class: "block w-1/2 text-right text-sm font-medium text-green-900 mr-3"
    b.use :input, class: "block w-full text-sm p-1.5 rounded-lg border border-green-300 focus:border-green-400 focus:ring focus:ring-green-200 focus:ring-opacity-50"
    b.use :full_error, wrap_with: { tag: "p", class: "text-sm text-red-600 mt-2" }
    b.use :hint, wrap_with: { tag: "p", class: "text-sm text-green-400" }
  end

  config.wrapper_mappings = {
    boolean: :tailwind_form
  }
end
