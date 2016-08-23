'use strict';
angular.module('app', [])
    .controller('main', function ($scope) {
        $scope.compareOpersByDate = function (a, b) {
            return Date.parse(a.time) < Date.parse(b.time);
        };

        $scope.transactions = [
            createTransaction(5000.00, "2016-07-31T20:22:26Z", "Работа", "Выполнил заказ на фрилансе"),
            createTransaction(-35.00, "2016-07-31T20:24:02Z", "Транспорт", "Проезд на маршрутке")
        ].sort($scope.compareOpersByDate);

        $scope.filters = [
            {name: 'Все', label: 'Ваш баланс', method: function() {return true;}},
            {name: 'Доходы', label: 'Ваш доход', method: function(elem) {return parseFloat(elem.value) > 0;}},
            {name: 'Траты', label: 'Ваши расходы', method: function(elem) {return parseFloat(elem.value) < 0;}}
        ];

        $scope.timeFilters = [
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

        $scope.selectedTimeFilter = $scope.timeFilters[0];

        $scope.label = "Ваш баланс " + $scope.selectedTimeFilter.name.toLowerCase();

        $scope.selectTimeFilter = function (filter) {
            $scope.selectedTimeFilter = filter;
        };

        $scope.selectedFilter = $scope.filters[0];

        $scope.selectFilter = function (filter) {
            $scope.selectedFilter = filter;
        };

        $scope.getFilteredTransactions = function () {
            $scope.label = $scope.selectedFilter.label + " " + $scope.selectedTimeFilter.name.toLowerCase();
            $scope.balance = updateBalance();
            return $scope.transactions
                .filter($scope.selectedTimeFilter.method)
                .filter($scope.selectedFilter.method);
        };

        function add(a, b) {
            return a + b;
        }

        function updateBalance() {
            var result =  $scope.transactions
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
            console.log($scope.value, $scope.description, $scope.category);
            if (parseFloat($scope.value) != undefined && $scope.description != undefined &&
                                                                $scope.category != undefined) {
                var value = $scope.money, action = $scope.action, category = $scope.category,
                    description = $scope.description, time = new Date();

                if (action == 'spent') {
                    value = -value;
                }

                var newTransaction = createTransaction(value, time, category, description);
                $scope.transactions.unshift(newTransaction);
                $scope.balance = updateBalance();
                $scope.money = "";
                $scope.category = "";
                $scope.description = "";
            }
        };

        function createTransaction(value, time, category, description) {
            var decoration, val, dt_formatted, dt = new Date(time);
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

        function isEmptyString(str) {
            return /^\s*$/.test(str);
        }

        $scope.spendings = [
            "Еда и напитки",
            "Мобильная связь",
            "Транспорт",
            "Интернет",
            "Медицина",
            "Квартира",
            "Магазины",
            "Спорт",
            "Подарки и обувь",
            "Одежда",
            "Рестораны и кафе",
            "Путешествия",
            "Промтовары",
            "Гаджеты",
            "Необдуманные траты",
            "Другое"
        ];

        $scope.profits = [
            "Работа",
            "Еще одна работа",
            "Приятные находки",
            "Подработка",
            "Проценты по счетам",
            "Возврат долга",
            "Другое"
        ];

        $scope.categories = $scope.spendings;
        $scope.action = "spent";

        $scope.changeCategories = function () {
            if ($scope.action == "spent") {
                $scope.categories = $scope.spendings;
            } else {
                $scope.categories = $scope.profits;
            }
        };

        $scope.deleteTransaction = function (index) {
            $scope.transactions.splice(index, 1);
            $scope.balance = updateBalance();
        };

    });