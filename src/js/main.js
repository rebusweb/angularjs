angular.module('todoListApp', []);

angular.module('todoListApp').component('todoList', {
  controller: function() {
    let ctrl = this;
    ctrl.list = [];
    ctrl.addToList = function(item) {
      if (!item || !item.trim()) {
        return;
      }
      ctrl.list.unshift(item.trim());
      console.log('addToList', ctrl.list);
    };
    ctrl.deleteFromList = function(index) {
      ctrl.list.splice(index, 1);
      console.log('deleteFromList', index, ctrl.list);
    };
    ctrl.editList = function(index, value) {
      console.log('editList');
      ctrl.list[index] = value;
    }
  },
  template: `
  <add-new-item add-item="$ctrl.addToList(item)"></add-new-item>
  <item-list list="$ctrl.list" delete-item="$ctrl.deleteFromList(index)" edit-item="$ctrl.editList(index, value)"></item-list>
  `
});

angular.module('todoListApp').component('addNewItem', {
  bindings: {
    item: '<',
    addItem: '&'
  },
  controller: function() {
     let ctrl = this;
     ctrl.addNewItem = function() {
       ctrl.addItem({item: ctrl.item});
       ctrl.item = '';
     }
  },
  template: `
  <form class="form-inline">
    <input type="text" class="form-control" ng-model="$ctrl.item">
    <button class="btn btn-default" ng-click="$ctrl.addNewItem()">add</button>
  </form>
  `
});

angular.module('todoListApp').component('itemList', {
  bindings: {
    list: '<',
    deleteItem: '&',
    editItem: '&'
  },
  controller: function() {
    let ctrl = this;
    ctrl.edit = function(index, value) {
      console.log('edit');
      ctrl.editItem({index: index, value: value})
    };
    ctrl.delete = function(index) {
      console.log('delete', index);
      ctrl.deleteItem({index: index});
    }
  },
  template: `
  <table class="table table-hover table-bordered">
    <tr ng-repeat="item in $ctrl.list track by $index">
      <td><item index="$index" value="item" delete-item="$ctrl.delete(index)" edit-item="$ctrl.edit(index, value)"></item></td>
    </tr>
  </table>
  `
});

angular.module('todoListApp').component('item', {
  bindings: {
    index: '<',
    value: '<',
    deleteItem: '&',
    editItem: '&'
  },
  controller: function() {
    let ctrl = this;
    ctrl.$onInit = function() {
      ctrl.editMode = false;
    }
    ctrl.editSave = function(index) {
      if (ctrl.editMode) {
        console.log('editSave save');
        ctrl.editItem({index: ctrl.index, value: ctrl.value})
      } else {
        console.log('editSave reset');
        // do nothing
      }
      ctrl.editMode = !ctrl.editMode;
    };
    ctrl.delete = function(index) {
      console.log('delete', index);
      ctrl.deleteItem({index: index});
    }
  },
  template: `
    <form class="form-inline">
    <span ng-if="!$ctrl.editMode">
      {{ $ctrl.value }}
    </span>
    <span ng-if="$ctrl.editMode">
      <input type="text" class="form-control" ng-model="$ctrl.value">
    </span>
    <button class="btn btn-default" ng-click="$ctrl.editSave($ctrl.index)">
      <span ng-if="!$ctrl.editMode">edit</span>
      <span ng-if="$ctrl.editMode">save</span>
    </button>
    <button class="btn btn-default" ng-click="$ctrl.delete($ctrl.index)">delete</button>
    </form>
  `
});
