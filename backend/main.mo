import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Run migration code and replace implementation with migrated code on upgrade

actor {
  public type UserProfile = {
    displayName : Text;
    avatarUrl : ?Text;
    bio : ?Text;
  };

  public type Post = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
    imageUrl : ?Text;
  };

  public type Comment = {
    id : Nat;
    postId : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  public type Like = {
    postId : Nat;
    user : Principal;
  };

  var nextPostId = 1;
  var nextCommentId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let posts = Map.empty<Nat, Post>();
  let comments = Map.empty<Nat, Comment>();
  let likes = Map.empty<Nat, List.List<Principal>>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Save the caller's own profile — requires authenticated user
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Get the caller's own profile — requires authenticated user
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their own profile");
    };
    userProfiles.get(caller);
  };

  // Get any user's profile — public read for social media (guests and users alike)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Public social media profiles are readable by anyone, including guests
    userProfiles.get(user);
  };

  // Create a new post — requires authenticated user
  public shared ({ caller }) func createPost(content : Text, imageUrl : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    let post : Post = {
      id = nextPostId;
      author = caller;
      content;
      timestamp = Time.now();
      imageUrl;
    };

    posts.add(nextPostId, post);
    likes.add(nextPostId, List.empty<Principal>());
    nextPostId += 1;
    post.id;
  };

  // Get a single post by ID — public read
  public query ({ caller }) func getPost(id : Nat) : async ?Post {
    posts.get(id);
  };

  module Post {
    public func compareDescending(post1 : Post, post2 : Post) : Order.Order {
      if (post1.timestamp < post2.timestamp) {
        #greater;
      } else if (post1.timestamp > post2.timestamp) {
        #less;
      } else {
        #equal;
      };
    };
  };

  // Get all posts sorted by newest first — public read
  public query ({ caller }) func getAllPosts() : async [Post] {
    let postsArray = posts.toArray().map(func((_, post)) { post });
    postsArray.sort(Post.compareDescending);
  };

  // Add a comment to a post — requires authenticated user
  public shared ({ caller }) func addComment(postId : Nat, content : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can comment");
    };

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post does not exist") };
      case (?_) {
        let comment : Comment = {
          id = nextCommentId;
          postId;
          author = caller;
          content;
          timestamp = Time.now();
        };

        comments.add(nextCommentId, comment);
        nextCommentId += 1;
        comment.id;
      };
    };
  };

  // Get all comments for a post — public read
  public query ({ caller }) func getCommentsForPost(postId : Nat) : async [Comment] {
    comments.toArray().filter(func((_, comment)) { comment.postId == postId }).map(func((_, comment)) { comment });
  };

  // Toggle like on a post — requires authenticated user
  public shared ({ caller }) func toggleLike(postId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like posts");
    };

    switch (likes.get(postId)) {
      case (null) { Runtime.trap("Post does not exist") };
      case (?userList) {
        if (userList.any(func(user) { user == caller })) {
          let filteredList = userList.filter(func(user) { user != caller });
          likes.add(postId, filteredList);
          false;
        } else {
          userList.add(caller);
          likes.add(postId, userList);
          true;
        };
      };
    };
  };

  // Get like count for a post — public read
  public query ({ caller }) func getLikeCount(postId : Nat) : async Nat {
    switch (likes.get(postId)) {
      case (null) { 0 };
      case (?userList) { userList.size() };
    };
  };
};
