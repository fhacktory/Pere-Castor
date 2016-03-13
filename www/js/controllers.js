var user = {};

var currentStory = {};

var currentChapter = {};

var URL = 'http://private-efb1b-perecastor.apiary-mock.com';

angular.module('app.controllers', [])

.controller('loginCtrl', function($scope, $state, $http) {
    $scope.user = {
        pseudo: '',
        password: ''
    };
    $scope.working = false;
    $scope.login = function() {
        $scope.working = true;
        $http({
            method: 'POST',
            url: URL + '/auth/',
            data: JSON.stringify($scope.user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .success(function(data) {
                user.pseudo = $scope.user.pseudo;
                user.token = data.result.token;
                $http({
                    method: 'GET',
                    url: URL + '/api/users/' + user.pseudo + '/stories?token=' + user.token
                })
                    .success(function(data) {
                        user.stories = data.map(function(m) {
                            m.isSaved = true;
                            return m;
                        });
                        $state.go('stories');
                        $scope.working = false;
                    })
                    .error(function(err) {
                        $scope.working = false;
                        alert('Error during authentication');
                    });
            })
            .error(function(err) {
                $scope.working = false;
                alert('Error during authentication');
            });
    };
})

.controller('signupCtrl', function($scope) {

})

.controller('storiesCtrl', function($scope, $state, $http) {
    $scope.stories = user.stories;
    $scope.filteredStories = $scope.stories;
    $scope.working = false;
    $scope.utils = {
        filterStr: ''
    };

    $scope.addNew = function() {
        $scope.stories.push({
            storyName: "",
            public: false,
            nbRead: 0,
            index: $scope.stories.length || 0
        })
    }

    $scope.filter = function() {
        if ($scope.utils.filterStr == '') {
            $scope.filteredStories = $scope.stories;
        } else {
            $scope.filteredStories = [];
            var i = $scope.stories.length;
            while (i--) {
                if ($scope.stories[i].storyName.match($scope.utils.filterStr)) {
                    $scope.filteredStories.push($scope.stories[i]);
                }
            }
        }
    }

    $scope.syncAll = function() {
        var i = $scope.stories.length;
        while (i--) {
            $scope.sync($scope.stories[i]);
        }
    }

    $scope.delete = function(story) {
        $scope.working = true;
        $http({
            method: 'DELETE',
            url: URL + '/api/users/' + user.pseudo + '/stories/' + story.id + '?token=' + user.token
        })
            .success(function(data) {
                $scope.working = false;
                $scope.stories.splice(story.index, 1);
            })
            .error(function(err) {
                $scope.working = false;
                alert('Error during authentication');
            });
    }

    $scope.sync = function(story) {
        $scope.working = true;
        var req = {
            token: user.token,
            story: {
                storyName: story.storyName,
                public: story.public,
                nbRead: story.nbRead,
                index: story.index
            }
        }
        var method = 'POST';
        var path = '/api/users/' + user.pseudo + '/stories';

        if (story.isSaved) {
            method = 'PUT';
            path += ('/' + story.id);
        }
        $http({
            method: method,
            url: URL + path,
            data: JSON.stringify(req),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .success(function(data) {
                $scope.working = false;
                if (data.id) {
                    story.id = data.id;
                }
                story.isSaved = true;
            })
            .error(function(err) {
                $scope.working = false;
                alert('Error during authentication');
            });
    }

    $scope.edit = function(story) {
        $scope.working = true;
        angular.copy(story, currentStory);

        $http({
            method: 'GET',
            url: URL + '/api/users/' + user.pseudo + '/stories/' + story.id + '/chapters?token=' + user.token
        })
            .success(function(data) {
                currentStory.chapters = data;
                $state.go('chapters');
                $scope.working = false;
            })
            .error(function(err) {
                $scope.working = false;
                alert('Error during authentication');
            });
    }
})

.controller('chaptersCtrl', function($scope, $state, $http, $cordovaImagePicker, $ionicPlatform) {
    $scope.chapters = currentStory.chapters
    $scope.filteredChapters = $scope.chapters;

    $scope.utils = {
        filterStr: ''
    };

    $scope.addNew = function() {
        currentStory.chapters.push({
            chapterName: "",
            image: "",
            createdAt: new Date(),
            index: currentStory.chapters.length || 0
        })
    }

    $scope.filter = function() {
        if ($scope.utils.filterStr == '') {
            $scope.filteredChapters = $scope.chapters;
        } else {
            $scope.filteredChapters = [];
            var i = $scope.chapters.length;
            while (i--) {
                if ($scope.chapters[i].chapterName.match($scope.utils.filterStr)) {
                    $scope.filteredChapters.push($scope.chapters[i]);
                }
            }
        }
    }

    $scope.syncAll = function() {
        var i = currentStory.chapters.length;
        while (i--) {
            $scope.sync(currentStory.chapters[i]);
        }
    }

    $scope.sync = function(chapter) {
        $scope.working = true;
        var req = {
            token: user.token,
            chapter: {
                chapterName: chapter.chapterName,
                index: chapter.index,
                image: chapter.image
            }
        }
        var method = 'POST';
        var path = '/api/users/' + user.pseudo + '/stories/' + currentStory.id + '/chapters';

        if (chapter.isSaved) {
            method = 'PUT';
            path += ('/' + chapter.id);
        }
        $http({
            method: method,
            url: URL + path,
            data: JSON.stringify(req),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .success(function(data) {
                $scope.working = false;
                if (data.id) {
                    chapter.id = data.id;
                }
                chapter.isSaved = true;
            })
            .error(function(err) {
                $scope.working = false;
                alert('Error during authentication');
            });
    }

    $scope.getImage = function(chapter) {
        // Image picker will load images according to these settings
        var options = {
            maximumImagesCount: 1,
            width: 800,
            height: 800,
            quality: 80
        };

        $cordovaImagePicker.getPictures(options).then(function(results) {
                chapter.image = results[0];

                window.plugins.Base64.encodeFile(chapter.image, function(base64) {
                    chapter.image = base64;
                });
            },
            function(error) {
                alert('Error: ' + JSON.stringify(error)); // In case of error
            });
    };

    $scope.delete = function(chapter) {
        $scope.working = true;
        $http({
            method: 'DELETE',
            url: URL + '/api/users/' + user.pseudo + '/stories/' + currentStory.id + '/chapters/' + currentStory.id + '?token=' + user.token
        })
            .success(function(data) {
                $scope.working = false;
                currentStory.chapters.splice(chapter.index, 1);
            })
            .error(function(err) {
                $scope.working = false;
                alert('Error during authentication');
            });
    }

    $scope.edit = function(chapter) {
        $scope.working = true;
        angular.copy(chapter, currentChapter);

        $http({
            method: 'GET',
            url: URL + '/api/users/' + user.pseudo + '/stories/' + currentStory.id + '/chapters/' + chapter.id + '/pages?token=' + user.token
        })
            .success(function(data) {
                currentChapter.pages = data;
                $state.go('pages');
                $scope.working = false;
            })
            .error(function(err) {
                $scope.working = false;
                alert('Error during authentication');
            });
    }
})

.controller('pagesCtrl', function($scope, $state, $http, $cordovaImagePicker, $ionicPlatform) {
    $scope.pages = currentChapter.pages
    $scope.filteredPages = $scope.pages;

    $scope.utils = {
        filterStr: ''
    };

    $scope.addNew = function() {
        currentChapter.pages.push({
            title: "",
            description: "",
            text: "",
            image: "",
            createdAt: new Date(),
            index: currentStory.pages.length || 0
        })
    }

    $scope.filter = function() {
        if ($scope.utils.filterStr == '') {
            $scope.filteredPages = $scope.pages;
        } else {
            $scope.filteredPages = [];
            var i = $scope.pages.length;
            while (i--) {
                if ($scope.pages[i].title.match($scope.utils.filterStr)) {
                    $scope.filteredPages.push($scope.pages[i]);
                }
            }
        }
    }

    $scope.syncAll = function() {
        var i = currentChapter.pages.length;
        while (i--) {
            $scope.sync(currentChapter.pages[i]);
        }
    }

    $scope.sync = function(page) {
        $scope.working = true;
        var req = {
            token: user.token,
            page: {
                title: page.title,
                description: page.description,
                text: page.text,
                createdAt: page.createdAt,
                index: page.index
            }
        }
        var method = 'POST';
        var path = '/api/users/' + user.pseudo + '/stories/' + currentStory.id + '/chapters/' + currentChapter.id;

        if (page.isSaved) {
            method = 'PUT';
            path += ('/' + page.id);
        }
        $http({
            method: method,
            url: URL + path,
            data: JSON.stringify(req),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .success(function(data) {
                $scope.working = false;
                if (data.id) {
                    page.id = data.id;
                }
                page.isSaved = true;
            })
            .error(function(err) {
                $scope.working = false;
                alert('Error during authentication');
            });
    }

    $scope.getImage = function(page) {
        // Image picker will load images according to these settings
        var options = {
            maximumImagesCount: 1,
            width: 800,
            height: 800,
            quality: 80
        };

        $cordovaImagePicker.getPictures(options).then(function(results) {
                page.image = results[0];

                window.plugins.Base64.encodeFile(page.image, function(base64) {
                    page.image = base64;
                });
            },
            function(error) {
                alert('Error: ' + JSON.stringify(error)); // In case of error
            });
    };

    $scope.delete = function(page) {
        $scope.working = true;
        $http({
            method: 'DELETE',
            url: URL + '/api/users/' + user.pseudo + '/stories/' + currentStory.id + '/chapters/' + currentStory.id + '/pages/' + currentChapter.id + '?token=' + user.token
        })
            .success(function(data) {
                $scope.working = false;
                currentChapter.pages.splice(page.index, 1);
            })
            .error(function(err) {
                $scope.working = false;
                alert('Error during authentication');
            });
    }
})