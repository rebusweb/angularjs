todoListApp.controller('TodoListController', function TodoListController($scope, $uibModal, $log, $document) {
  let $ctrl = this;
  $ctrl.items = ['item1', 'item2', 'item3'];
  $ctrl.showForm = 0;
  $ctrl.lists = [];
  $ctrl.animationsEnabled = true;
  $scope.addForm = function (size, parentSelector) {
    const parentElem = parentSelector ?
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    const modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      windowTemplateUrl: 'window.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        items: function () {
          return $ctrl.items;
        }
      }
    });
    };
});

todoListApp.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
  let $ctrl = this;
  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };

  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected.item);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
