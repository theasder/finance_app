'use strict';
var app = angular.module('app', ['chart.js']);

app.factory('transactions', function() {
    function createTransaction(value, time, category, description) {
        var decoration, val, dt = new Date(time);
        if (value > 0) {
            val = "+" + value + " руб.";
            decoration = "up";
        } else if (value < 0) {
            val = value + " руб.";
            decoration = "down";
        }

        return {
            value: val,
            time: dt,
            category: category,
            description: description,
            status: 'added',
            decoration: decoration
        }
    }

    var compareOpersByDate = function (a, b) {
        return Date.parse(a.time) < Date.parse(b.time);
    };

    var data = [
        createTransaction(28400.00, "2016-08-25T08:22:26Z", "Работа", "Зарплата"),
        createTransaction(-17000.00, "2016-08-23T20:22:26Z", "Квартира", "Аренда"),
        createTransaction(12040.00, "2016-08-22T20:22:26Z", "Еще одна работа", "Выполнил заказ на фрилансе"),
        createTransaction(-7000.00, "2016-08-21T20:22:26Z", "Кафе и рестораны", "День Рождения Ларисы Ивановны"),
        createTransaction(-1975.00, "2016-08-20T20:22:26Z", "Еда и напитки", "Букварь Вкуса"),
        createTransaction(-1890.00, "2016-08-19T20:22:26Z", "Одежда и обувь", "Ostin"),
        createTransaction(-400.00, "2016-08-18T20:22:26Z", "Мобильная связь", "Телефон"),
        createTransaction(-35.00, "2016-07-31T20:24:02Z", "Транспорт", "Проезд на маршрутке")
    ].sort(compareOpersByDate);

    function addTransaction(value, action, category, description) {
        console.log(value, category);
        if (parseFloat(value) <= 0 && value != "" && category != undefined) {
            var time = new Date();

            if (action == 'spent') {
                value = -value;
            }

            if (description == undefined) {
                description = category;
            }

            var newTransaction = createTransaction(parseFloat(value), time, category, description);
            data.unshift(newTransaction);
        }
    }

    function deleteTransaction(index) {
        data.splice(index, 1);
    }
    var filter = {name: 'Все', label: 'Ваш баланс', method: function() {return true;}};
    var timeFilter = {name: "За всё время", method: function() {return true;}};

    function getFilter() {
        return filter;
    }

    function getTimeFilter() {
        return timeFilter;
    }

    function setFilter(fltr) {
        filter = fltr;
    }

    function setTimeFilter(fltr) {
        timeFilter = fltr;
    }

    function add(a, b) {
        return a + b;
    }

    function categoriesData(categoryList) {
        var categoryValue, result = [];

        for (var i = 0; i < categoryList.length; i++) {

            categoryValue = data
                .filter(timeFilter.method)
                .filter(function (elem) {
                    return elem.category == categoryList[i];
                })
                .map(function (elem) {
                    return Math.abs(parseFloat(elem.value));
                })
                .reduce(add, 0);

            result.push(categoryValue);
        }
        return result;
    }

    return {
        data: data,
        createTransaction: createTransaction,
        addTransaction: addTransaction,
        deleteTransaction: deleteTransaction,
        setFilter: setFilter,
        setTimeFilter: setTimeFilter,
        getFilter: getFilter,
        getTimeFilter: getTimeFilter,
        categoriesData: categoriesData,
        timeFilter: timeFilter
    }
});


app.factory('filters', function() {
   return [
       {name: 'Все', label: 'Ваш баланс', method: function() {return true;}},
       {name: 'Доходы', label: 'Ваш доход', method: function(elem) {return parseFloat(elem.value) > 0;}},
       {name: 'Траты', label: 'Ваши расходы', method: function(elem) {return parseFloat(elem.value) < 0;}}
   ];
});

app.factory('timeFilters', function() {
    return [
        {name: "За всё время", method: function() {return true;}},
        {name: "В этом году", method: function(elem) {
            var year = new Date().getFullYear();
            return elem.time.getFullYear() === year;
        }},
        {name: "В этом месяце", method: function(elem) {
            var today = new Date();
            return elem.time.getFullYear() === today.getFullYear() &&
                elem.time.getMonth() === today.getMonth();
        }},
        {name: "На этой неделе", method: function(elem) {
            var today = new Date();
            var weekdaySeconds = (today.getDay() - 1) * 24 * 60 * 60
                + today.getHours() * 60 * 60 + today.getMinutes() * 60 + today.getSeconds();

            return elem.time.getTime() / 1000 >= today.getTime() / 1000 - weekdaySeconds;
        }},
        {name: "Сегодня", method: function(elem) {
            var today = new Date();
            return elem.time.getFullYear() === today.getFullYear()
                && elem.time.getMonth() === today.getMonth()
                && elem.time.getDate() === today.getDate();
        }}
    ];
});

app.constant('spendings', [
    "Еда и напитки",
    "Мобильная связь",
    "Транспорт",
    "Интернет",
    "Медицина",
    "Квартира",
    "Магазины",
    "Спорт",
    "Подарки",
    "Одежда и обувь",
    "Рестораны и кафе",
    "Путешествия",
    "Промтовары",
    "Гаджеты",
    "Необдуманные траты",
    "Другое"
]);

app.constant('profits', [
    "Работа",
    "Еще одна работа",
    "Приятные находки",
    "Подработка",
    "Проценты по счетам",
    "Возврат долга",
    "Другое"
]);

app.controller('main', function ($scope, transactions, spendings, profits, filters, timeFilters) {

    $scope.filters = filters;
    $scope.timeFilters = timeFilters;
    $scope.selectedTimeFilter = $scope.timeFilters[0];
    $scope.label = "Ваш баланс " + $scope.selectedTimeFilter.name.toLowerCase();
    $scope.selectedGraph = "Все";

    $scope.selectTimeFilter = function (filter) {
        transactions.setTimeFilter(filter);
        $scope.selectedTimeFilter = filter;
    };

    $scope.selectedFilter = $scope.filters[0];

    $scope.selectFilter = function (filter) {
        transactions.setFilter(filter);
        $scope.selectedFilter = filter;
        $scope.selectedGraph = filter.name;
    };

    $scope.transactionsData = transactions.data;

    $scope.getFilteredTransactions = function () {
        $scope.label = $scope.selectedFilter.label + " " + $scope.selectedTimeFilter.name.toLowerCase();
        $scope.balance = updateBalance();
        $scope.transactionsData = transactions.data
            .filter($scope.selectedTimeFilter.method)
            .filter($scope.selectedFilter.method);
        return $scope.transactionsData;
    };

    function add(a, b) {
        return a + b;
    }

    function updateBalance() {
        var result =  transactions.data
                        .filter($scope.selectedTimeFilter.method)
                        .filter($scope.selectedFilter.method)
                        .map(function (elem) { return parseFloat(elem.value); })
                        .reduce(add, 0);
        if ($scope.selectedFilter.name == "Траты") {
            result = - result;
        }
        return result;
    }

    $scope.balance = updateBalance();

    $scope.addTransaction = function() {
        transactions.addTransaction($scope.money, $scope.action, $scope.category, $scope.description);
        $scope.balance = updateBalance();
        $scope.money = "";
        $scope.category = "";
        $scope.description = "";
    };

    $scope.spendings = spendings;
    $scope.profits = profits;

    $scope.categories = spendings;
    $scope.action = "spent";

    $scope.changeCategories = function () {
        if ($scope.action == "spent") {
            $scope.categories = $scope.spendings;
        } else {
            $scope.categories = $scope.profits;
        }
    };

    $scope.deleteTransaction = function(index) {
        transactions.deleteTransaction(index);
        $scope.balance = updateBalance();
    }

});

app.controller('spendCtrl', function($scope, spendings, transactions) {
    $scope.labels = spendings;
    $scope.data = transactions.categoriesData(spendings);

    $scope.$watchCollection('transactionsData', function() {
        $scope.data = transactions.categoriesData(spendings);
    });
});

app.controller('profitCtrl', function($scope, profits, transactions) {
    $scope.labels = profits;
    $scope.data = transactions.categoriesData(profits);

    $scope.$watchCollection('transactionsData', function() {
        $scope.data = transactions.categoriesData(profits);
    });
});






