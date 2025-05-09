import { Controller } from "@hotwired/stimulus"
import Sortable from "sortablejs"

export default class extends Controller {
  static targets = ["list"];

  static values = {
    url: String
  };

  connect() {
    this.sortable = Sortable.create(this.listTarget, {
      animation: 150,
      onEnd: this.end.bind(this)
    });
  }

  end(event) {
    const ids = Array.from(this.listTarget.children).map(el => el.dataset.id);
    this.saveOrder(ids);
  }

  async saveOrder(ids) {
    const url = this.urlValue;
    const token = document.querySelector('meta[name="csrf-token"]').content;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
      body: JSON.stringify({ order: ids })
    });

    if (!response.ok) {
      console.error("Failed to save the order");
    }

    const event = new CustomEvent('cities:orderUpdated', {
      bubbles: true,
      detail: { ids }
    });

    const parentElement = this.element.closest('.parent-class');
    parentElement.dispatchEvent(event);
  }
}
