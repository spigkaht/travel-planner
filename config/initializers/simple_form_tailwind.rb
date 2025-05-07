SimpleForm.setup do |config|
  config.wrappers :tailwind_form, tag: 'div', class: 'mb-5', error_class: '' do |b|
    b.use :html5
    b.use :label, class: 'block text-sm font-medium text-gray-700'
    b.use :input, class: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
    b.use :full_error, wrap_with: { tag: 'p', class: 'text-sm text-red-600 mt-2' }
    b.use :hint, wrap_with: { tag: 'p', class: 'text-sm text-gray-500' }
  end
end
