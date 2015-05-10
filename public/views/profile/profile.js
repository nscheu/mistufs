app.controller('ProfileCtrl', function ($scope, $http, $location,$rootScope) {
  console.log("Profile Controller");
  //$scope.currentUser = $rootScope.currentUser;
  //$scope.friends = $scope.currentUser.friends;
  $scope.phones = $scope.currentUser.phones;
  $scope.items = $scope.currentUser.items;
  $scope.locations = $scope.currentUser.locations;
  $scope.friendRequests = $scope.currentUser.friendRequests;
  //$scope.friends = parseFriendList($scope.currentUser.friends);
  $scope.sentFriendRequests = $scope.currentUser.sentFriendRequests;
  console.log($scope.friendRequests);
  //console.log($scope.friends);


  // USER OPERATIONS ************************************************
  // Get all users from DB
  $http.get("/rest/user")
    .success(function (users) {
      $scope.users = users;
      $scope.friends = parseFriendList($scope.currentUser.friends);
      //console.log($scope.friends);
    });

  // Delete a user from the DB
  $scope.delUser = function (user) {
    var index = $scope.users.indexOf(user);
    $scope.users.splice(index, 1);
    $http.post("/rest/delUser", user)
      .success(function (deleteduser) {
        //console.log("deleterdUser =", user);
        $location.url("/profile");
      });
  };

  function getUserById(id) {
    //console.log(id);
    for (i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i]._id == id) {
        //console.log("Success Find User");
        return $scope.users[i];
      }
    }
    return -1;
  }

  function updateUserDB(updatedUser) {
    $http.post("/api/updateUser", updatedUser)
       .success(function (resource) {
         console.log("RESOURCE ==");
         console.log(resource);
         $scope.currentUser = updatedUser;
       });
  };


  // MODALS **********************************************************

  // Opens the Update User Modal
  $scope.openUpdateUserModal = function (user) {
    $scope.updateUser = user;
    $("#openUpdateUserModal").modal('show');
  };

  //Updates the user
  $scope.updateUserInDb = function (updatedUser) {
    $("#openUpdateUserModal").modal('hide');
    updateUserDB(updatedUser);
    $location.url("/profile");
  };

  // Opens the Add New Item Modal
  $scope.openAddNewItemModal = function () {
    $("#openAddNewItemModal").modal('show');
  };

  // Adds a new item to the currentUser and the scope.items arrays
  $scope.addNewItem = function (item) {
    console.log(item);
    if ($scope.currentUser.items.indexOf(item) == -1) {
      $scope.currentUser.items.push(item);
      $scope.items = $scope.currentUser.items;
    
      var updatedUser = $scope.currentUser;
      $("#openAddNewItemModal").modal('hide');
      updateUserDB(updatedUser);
      $location.url("/profile");
    }
  };

  // Opens the Update Item Modal
  $scope.openUpdateItemModal = function (item) {
    $scope.updatedItem = item;
    console.log($scope.updatedItem);
    $("#openUpdateItemModal").modal('show');
  };
  
  // Update an Item from Current Users Item List
  $scope.updateItem = function (updatedItem) {
    console.log("UPDATE ITEM");
    console.log($scope.updatedItem);
    var index = $scope.currentUser.items.indexOf($scope.updatedItem);
    console.log(index);
    if (index > -1) {
      $scope.currentUser.items[index] = updatedItem;
      $scope.items = $scope.currentUser.items;
      var updatedUser = $scope.currentUser;
      $("#openUpdateItemModal").modal('hide');
      updateUserDB(updatedUser);
      $location.url("/profile");
    }
  };

  // Delete an Item from Current Users Item List
  $scope.deleteItem = function (item) {
    var index = $scope.currentUser.items.indexOf(item);
    if (index > -1) {
      $scope.currentUser.items.splice(index, 1);
      $scope.items = $scope.currentUser.items;

      var updatedUser = $scope.currentUser;
      updateUserDB(updatedUser);
      $location.url("/profile");
    }
  };






  


  // FRIEND FUNCTIONS *********************************************

  // gets the index of a request in an array, returns array index
  function getRequestId(array, sourceId, recipientId) {
    console.log(array);
    for (i = 0; i < array.length; i++) {
      if (array[i].sourceUserId == sourceId && array[i].recipient == recipientId) {
        return i;
      }
      return -1;
    }
  };

  // Delete a friend
  $scope.unfriend = function (friend) {
    // Remove the current user from the friends list
    var indexFriend = friend.friends.indexOf($scope.currentUser._id);
    console.log(friend);
    friend.friends.splice(indexFriend, 1);
    updateUserDB(friend);
    var index = $scope.currentUser.friends.indexOf(friend._id);
    console.log(index);
    //Remove the friend from the current users friends list
    $scope.currentUser.friends.splice(index, 1);
    //update friends in scope
    $scope.friends = parseFriendList($scope.currentUser.friends);
    updateUserDB($scope.currentUser);
    
    $location.url("/profile");
  };

  // Send a Friend Request
  $scope.sendRequest = function (newFriend) {
    if ($scope.friends.indexOf(newFriend) > -1) {
      console.log("Already Friends");
      return -1;
    }
    var request = {
      sourceUserId: $scope.currentUser._id,
      sourceFirstName: $scope.currentUser.firstName,
      sourceLastName: $scope.currentUser.lastName,
      recipient: newFriend._id,
      recFirstName: newFriend.firstName,
      recLastName: newFriend.lastName,
      dateSent: Date.now()
    };
    // If the recipients request list doesn't contain the request, add it
    if (newFriend.friendRequests.indexOf(request) == -1) {
      newFriend.friendRequests.push(request);
      updateUserDB(newFriend);
    }
    if ($scope.currentUser.sentFriendRequests.indexOf(request) == -1) {
      $scope.currentUser.sentFriendRequests.push(request);
      updateUserDB($scope.currentUser);
    }
    $location.url("/profile");

    /*$http.post('/api/sendFriendRequest', request)
     .success(function (user) {
       if (user) alert("Request Sent");
       //console.log(user);
       $location.url("/friends");
     });
     */
  };


  // Deny a friend request
  $scope.denyRequest = function (request) {
    console.log("DENY REQUEST");
    var senderId = request.sourceUserId;
    var recipientId = request.recipient;
    var sender = getUserById(senderId);
    var recipient = getUserById(recipientId);
    
    // Remove from respective lists
    var indexSender = getRequestId(sender.sentFriendRequests, request.sourceUserId, request.recipient);
    console.log(sender.sentFriendRequests[indexSender]);
    console.log(indexSender);
    if (indexSender > -1) {
      sender.sentFriendRequests.splice(indexSender, 1);
      console.log("DB UPDATE SENDER");
      updateUserDB(sender);
    }
    var indexRecipient = getRequestId(recipient.friendRequests, request.sourceUserId, request.recipient);
    console.log(recipient.friendRequests[0]);
    console.log(indexRecipient);
    if (indexSender > -1) {
      recipient.friendRequests.splice(indexRecipient, 1);
      $scope.currentUser = recipient;
      $scope.friendRequests = $scope.currentUser.friendRequests;
      console.log("DB UPDATE RECIPIENT");
      updateUserDB(recipient);
    }
    $location.url("/profile");
  };

  // Approve a friend request
  $scope.approveRequest = function (request) {
    console.log("APPROVE REQUEST");
    var senderId = request.sourceUserId;
    var recipientId = request.recipient;
    var sender = getUserById(senderId);
    //console.log(sender);
    var recipient = getUserById(recipientId);
    //console.log(recipient);

    // Remove from respective request lists and add to friends list
    var indexSender = getRequestId(sender.sentFriendRequests, request.sourceUserId, request.recipient);
    console.log(indexSender);
    if (indexSender > -1) {
      //remove from requests
      sender.sentFriendRequests.splice(indexSender, 1);
      //add to friendlist
      sender.friends.push(recipient._id);
      console.log("DB UPDATE SENDER");
      console.log(sender);
      updateUserDB(sender);
    }
    var indexRecipient = getRequestId(recipient.friendRequests, request.sourceUserId, request.recipient);
    console.log(indexRecipient);
    if (indexRecipient > -1) {
      // remove frome requests list
      recipient.friendRequests.splice(indexRecipient, 1);
      // add user to friends list
      recipient.friends.push(sender._id);
      // update current user in scope
      $scope.currentUser = recipient;
      // update friends list in scope
      $scope.friendRequests = $scope.currentUser.friendRequests;
      $scope.friends = parseFriendList($scope.currentUser.friends);
      console.log("DB UPDATE RECIPIENT");
      console.log(recipient);
      updateUserDB(recipient);
    }
    $location.url("/profile");
  };



  // Parse the friends list from a list of id's to a list of users data
  function parseFriendList(idList) {
    var index;
    var friendList = new Array();
    for (i = 0; i < $scope.users.length; i++) {
      index = idList.indexOf($scope.users[i]._id);
      //console.log(index);
      if (index > -1) {
        friendList.push($scope.users[i]);
      }
    }
    //console.log(friendList);
    return friendList;
  };

 
});
