// contains the business logics of the applications
(function () {
    "use strict";

    window.dotapedia.services = {
        stats: {
            initialized: false,
            name: null,
            developer: null,
            publisher: null,
            gameCoordinatorStatus: null,
            gameCoordinatorTitle: null,
            lastMonthUniquePlayersCount: null,
            yesterdayPeakConcurrentUsers: null,
            biWeeklyPlayersCount: null,
            biWeeklyPlayersCountVariance: null,
            update: function () {
                var self = this;
                if (self.initialized === true) {
                    return;
                }
                $.when(
                    $.ajax({
                        url: "https://www.dota2.com/jsfeed/uniqueusers",
                        dataType: "jsonp",
                        cache: false,
                        success: function (content) {
                            self.lastMonthUniquePlayersCount = new Number(content.users_last_month).toLocaleString();
                        }
                    }),
                    $.ajax({
                        url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%20%3D%20%22https%3A%2F%2Fsteamspy.com%2Fapi.php%3Frequest%3Dappdetails%26appid%3D570%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
                        dataType: "json",
                        cache: false,
                        success: function (content) {
                            self.name = content.query.results.json.name;
                            self.developer = content.query.results.json.developer;
                            self.publisher = content.query.results.json.publisher;
                            self.yesterdayPeakConcurrentUsers = new Number(content.query.results.json.ccu).toLocaleString();
                            self.biWeeklyPlayersCount = new Number(content.query.results.json.players_2weeks).toLocaleString();
                            self.biWeeklyPlayersCountVariance = new Number(content.query.results.json.players_2weeks_variance).
                                toLocaleString();
                        }
                    }),
                    $.ajax({
                        url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%20%3D%20%22https%3A%2F%2Fcrowbar.steamstat.us%2FBarney%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
                        dataType: "json",
                        cache: false,
                        success: function (content) {
                            self.gameCoordinatorStatus = content.query.results.json.services.dota2.status;
                            self.gameCoordinatorTitle = content.query.results.json.services.dota2.title;
                        }
                    })
                ).then(function () {
                    document.querySelector("#app-developer").innerHTML = "Developed and Published by " + self.developer;
                    document.querySelector('#app-status').innerHTML = self.gameCoordinatorTitle;
                    if (self.gameCoordinatorStatus === "good") {
                        document.querySelector('#app-status').classList.add("app-good-stats");
                    } else {
                        document.querySelector('#app-status').classList.add("app-bad-stats");
                    }
                    document.querySelector("#app-yesterday-count").innerHTML = self.yesterdayPeakConcurrentUsers;
                    document.querySelector('#app-monthly-count').innerHTML = self.lastMonthUniquePlayersCount;
                    document.querySelector("#homeprogressbar").style.visibility = "hidden";
                    self.initialized = true;
                });
            }
        },
        news: {
            intialized: false,
            newsItems: null,
            update: function () {
                var self = this;
                if (self.initialized === true) {
                    return;
                }

                $.when(
                    $.ajax({
                        dataType: "xml",
                        url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20'http%3A%2F%2Fblog.dota2.com%2Ffeed%2F'&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
                        cache: false,
                        success: function (content) {
                            self.newsItems = [];
                            $(content).find('item').each(function () {
                                var item = {
                                    title: $(this).find("title").text(),
                                    link: $(this).find("link").text(),
                                    publicationDate: new Date($(this).find("pubDate").text()).toLocaleString(),
                                    descriptionHtml: $(this).find("description").text(),
                                    contentHtml: $(this).find("content\\:encoded, encoded").text()
                                };
                                self.newsItems.push(item);
                            });

                        }
                    })
                ).then(function () {
                    var template = document.createElement("div");
                    var start = "<ons-list>";
                    var content = "";
                    self.newsItems.forEach(function (news) {
                        var item = sprintf(
                            "<ons-list-item><span class='list__item__title'><a class='news-title' href='%s'>%s</a></span><span class='list__item__subtitle news-caption'>%s</span><br/><span class='list__item__center'>%s</span></ons-list-item>", news.link, news.title, news.publicationDate, news.contentHtml);
                        content = content + item;
                    });

                    var end = "</ons-list>";
                    template.innerHTML = start + content + end;
                    document.querySelector("#newscontent").appendChild(template);
                    document.querySelector("#newsprogressbar").style.visibility = "hidden";
                    self.initialized = true;
                });
            }
        },
        updates: {
            initialized: false,
            updatesItems: null,
            update: function () {
                var self = this;
                if (self.initialized === true) {
                    return;
                }

                $.when(
                    $.ajax({
                        url:
                            "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%20%3D%20'https%3A%2F%2Fapi.steampowered.com%2FISteamNews%2FGetNewsForApp%2Fv0002%3Fappid%3D570%26Key%3D111E8DC6BD352EC8E25549E21C41DD17%26feeds%3Dsteam_updates'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
                        dataType: "json",
                        cache: false,
                        success: function (content) {
                            self.updatesItems = [];
                            $.each(content.query.results.appnews.newsitems, function (index, value) {
                                var item = {
                                    title: value.title,
                                    url: value.url,
                                    contentsHtml: value.contents
                                };

                                self.updatesItems.push(item);
                            });
                        }
                    })
                ).then(function () {
                    var template = document.createElement("div");
                    var start = "<ons-list>";
                    var content = "";
                    self.updatesItems.forEach(function (update) {
                        var item = sprintf(
                            "<ons-list-item><span class='list__item__title'><a class='updates-title' href='%s'>%s</a></span><span class='list__item__center'>%s</span></ons-list-item>", update.
                            url, update.title, update.contentsHtml);
                        content = content + item;
                    });

                    var end = "</ons-list>";
                    template.innerHTML = start + content + end;
                    document.querySelector("#updatescontent").appendChild(template);
                    document.querySelector("#updatesprogressbar").style.visibility = "hidden";
                    self.initialized = true;
                });
            }
        },
        heroes: {
            initialized: false,
            rawBiosContent: null,
            rawAdditionalInfoContent: null,
            rawStatsContent: null,
            rawAbilitiesContent: null,
            heroes: {},
            heroSmallImageUrl: "http://cdn.dota2.com/apps/dota2/images/heroes/%s_sb.png",
            heroMediumImageUrl: "http://cdn.dota2.com/apps/dota2/images/heroes/%s_lg.png",
            heroLargeImageUrl: "http://cdn.dota2.com/apps/dota2/images/heroes/%s_full.png",
            heroPortraitUrl: "http://cdn.dota2.com/apps/dota2/images/heroes/%s_vert.jpg",
            abilitySmallerImage: "http://cdn.dota2.com/apps/dota2/images/abilities/%s_md.png",
            abilitySmallImage: "http://cdn.dota2.com/apps/dota2/images/abilities/%s_hp1.png",
            abilityMediumImage: "http://cdn.dota2.com/apps/dota2/images/abilities/%s_hp2.png",
            abilityLargeImage: "http://cdn.dota2.com/apps/dota2/images/abilities/%s_lg.png",
            getHeroAbilityMatchKey: function (rawKey) {
                return rawKey.replace(/[^A-Za-z]+/g, "").toLowerCase();
            },
            update: function () {
                var self = this;
                if (self.initialized === true) {
                    return;
                }

                $.when(
                    $.ajax({
                        url: "https://www.dota2.com/jsfeed/heropickerdata?l=english",
                        dataType: "jsonp",
                        cache: false,
                        success: function (content) {
                            self.rawBiosContent = content;
                        }
                    }),
                    $.ajax({
                        url: "https://raw.githubusercontent.com/jonathandotchin/dotapedia/master/data/heroes.json",
                        dataType: "json",
                        cache: false,
                        success: function (content) {
                            self.rawAdditionalInfoContent = content;
                        }
                    }),
                    $.ajax({
                        url: "https://www.dota2.com/jsfeed/heropediadata?feeds=herodata&l=english",
                        dataType: "jsonp",
                        cache: false,
                        success: function (content) {
                            self.rawStatsContent = content;
                        }
                    }),

                    $.ajax({
                        url: "https://www.dota2.com/jsfeed/abilitydata?l=english",
                        dataType: "jsonp",
                        cache: false,
                        success: function (content) {
                            self.rawAbilitiesContent = content;
                        }
                    })
                ).then(function () {
                    // handle biographies
                    for (var property in self.rawBiosContent) {
                        if (self.rawBiosContent.hasOwnProperty(property)) {
                            var key = property;
                            if (self.heroes[key] === undefined) {
                                self.heroes[key] = {};
                                self.heroes[key].key = key;
                            }

                            var hero = self.rawBiosContent[property];
                            self.heroes[key].abilityMatchKey = self.getHeroAbilityMatchKey(key);
                            self.heroes[key].name = hero.name;
                            self.heroes[key].smallImage = sprintf(self.heroSmallImageUrl, key);
                            self.heroes[key].largeImage = sprintf(self.heroLargeImageUrl, key);
                            self.heroes[key].portrait = sprintf(self.heroPortraitUrl, key);
                            self.heroes[key].biography = hero.bio;
                            self.heroes[key].attack = hero.atk_l;

                            // handle the hero medium image
                            var image = new Image();
                            image.src = sprintf(self.heroMediumImageUrl, key);
                            self.heroes[key].mediumImage = image.src;

                            if (self.heroes[key].attack === "Melee") {
                                self.heroes[key].attackIcon = "/dotapedia/images/icons/melee.png";
                            } else {
                                self.heroes[key].attackIcon = "/dotapedia/images/icons/range.png";
                            }

                            self.heroes[key].roles = [];
                            hero.roles_l.forEach(function (role) {
                                self.heroes[key].roles.push(role);
                            });

                            // store some default faction 
                            // (because faction are added by me and it needs default)
                            // otherwise it blows
                            self.heroes[key].faction = {
                                name: "",
                                icon: ""
                            };
                        }
                    }
                }).then(function () {
                    // handle addtional info
                    for (var property in self.rawAdditionalInfoContent) {
                        if (self.rawAdditionalInfoContent.hasOwnProperty(property)) {
                            var key = property;
                            if (self.heroes[key] === undefined) {
                                self.heroes[key] = {};
                                self.heroes[key].key = key;
                            }

                            var hero = self.rawAdditionalInfoContent[property];
                            self.heroes[key].faction = {
                                name: hero.faction.name,
                                icon: hero.faction.icon
                            };

                            if (self.heroes[key].faction.name === 'radiant') {
                                self.heroes[key].faction.icon = "/dotapedia/images/icons/radiant.png";
                            }
                            else {
                                self.heroes[key].faction.icon = "/dotapedia/images/icons/dire.png";
                            }
                        }
                    }
                }).then(function () {
                    // handle stats
                    for (var property in self.rawStatsContent.herodata) {
                        if (self.rawStatsContent.herodata.hasOwnProperty(property)) {
                            var key = property;
                            if (self.heroes[key] === undefined) {
                                self.heroes[key] = {};
                                self.heroes[key].key = key;
                            }

                            var hero = self.rawStatsContent.herodata[property];
                            self.heroes[key].attribute = {
                                movementSpeed: hero.attribs.ms,
                                armor: hero.attribs.armor,
                                damage: {
                                    maximum: hero.attribs.dmg.max,
                                    minimum: hero.attribs.dmg.min
                                },
                                strength: {
                                    base: hero.attribs.str.b,
                                    gain: hero.attribs.str.g,
                                    primary: false
                                },
                                intelligence: {
                                    base: hero.attribs.int.b,
                                    gain: hero.attribs.int.g,
                                    primary: false
                                },
                                agility: {
                                    base: hero.attribs.agi.b,
                                    gain: hero.attribs.agi.g,
                                    primary: false
                                }
                            };

                            switch (hero.pa) {
                                case "str":
                                    self.heroes[key].attribute.strength.primary = true;
                                    self.heroes[key].attribute.primaryIcon = "http://cdn.dota2.com/apps/dota2/images/heropedia/overviewicon_str.png";
                                    break;
                                case "int":
                                    self.heroes[key].attribute.intelligence.primary = true;
                                    self.heroes[key].attribute.primaryIcon = "http://cdn.dota2.com/apps/dota2/images/heropedia/overviewicon_int.png";
                                    break;
                                case "agi":
                                    self.heroes[key].attribute.agility.primary = true;
                                    self.heroes[key].attribute.primaryIcon = "http://cdn.dota2.com/apps/dota2/images/heropedia/overviewicon_agi.png";
                                    break;
                            }
                        }
                    }
                }).then(function () {
                    // handle abilities
                    for (var property in self.rawAbilitiesContent.abilitydata) {
                        if (self.rawAbilitiesContent.abilitydata.hasOwnProperty(property)) {
                            // TODO: Find a better way to handle this
                            // skip the preview stuff
                            if (property === 'monkey_king_primal_spring_early') {
                                continue;
                            }

                            for (var candidateKey in self.heroes) {
                                if (self.heroes.hasOwnProperty(candidateKey)) {
                                    var abilityMatchKey = self.getHeroAbilityMatchKey(property);
                                    if (abilityMatchKey.indexOf(self.heroes[candidateKey].abilityMatchKey) === 0) {
                                        var key = candidateKey;
                                        var hero = self.rawAbilitiesContent.abilitydata[property];
                                        if (self.heroes[key].abilities === undefined) {
                                            self.heroes[key].abilities = new Array();
                                        }

                                        var ability = {
                                            key: property,
                                            name: hero.dname,
                                            affectsHtml: hero.affects,
                                            description: hero.desc,
                                            notesHtml: hero.notes,
                                            damageHtml: hero.dmg,
                                            attributeHtml: hero.attrib,
                                            cooldownManaCostHtml: hero.cmb,
                                            lore: hero.lore
                                        };

                                        // handle the hero medium image
                                        var image = new Image();
                                        image.src = sprintf(self.abilityMediumImage, ability.key);
                                        ability.image = image.src;

                                        self.heroes[key].abilities.push(ability);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }).then(function () {
                    // we want the keys in alpha order
                    var displayHeroes = [];
                    for (var key in self.heroes) {
                        if (self.heroes.hasOwnProperty(key)) {
                            displayHeroes.push(self.heroes[key]);
                        }
                    }

                    // so we sort the display heroes
                    displayHeroes.sort(function (k1, k2) {
                        return k1.name.localeCompare(k2.name);
                    });

                    // iterate through the "dictionary" with sorted keys
                    for (var k = 0; k < displayHeroes.length; ++k) {
                        var hero = displayHeroes[k];
                        var template = document.createElement("div");
                        var item = sprintf(
                            '<ons-list-item tappable><div class="left"><img class="list__item__thumbnail hero-thumbnail-portrait" src="%s"/></div><div class="center"><span class="list__item__title hero-thumbnail-name">%s</span><span class="list__item__subtitle"><img class="hero-filter-icon" src="%s"/><img class="hero-filter-icon" src="%s"/><img class="hero-filter-icon" src="%s"/></span></div></ons-list-item>',
                            hero.mediumImage, hero.name, hero.attribute.primaryIcon, hero.attackIcon, hero.faction.icon);
                        template.innerHTML = item;
                        var first = template.firstChild;
                        first.addEventListener("click", function (wrapHero) {
                            return function () {
                                document.querySelector('#navigatorcontrol').pushPage('pages/herodetails.html',
                                {
                                    data: {
                                        element: wrapHero
                                    }
                                });
                            };
                        }(hero));
                        document.querySelector("#heroes-list").appendChild(template);
                    }

                    document.querySelector("#heroesprogressbar").style.visibility = "hidden";
                    self.initialized = true;
                });
            }
        },
        items: {
            intialized: false,
            ignoredItemIds: [0, 71, 218, 238, 239, 241, 260, 264, 275, 276],
            recipeKey: "recipe",
            recipeName: "Recipe",
            recipeImage: "recipe_lg.png",
            goldLocalImage: "http://cdn.dota2.com/apps/dota2/images/tooltips/gold.png",
            items: {},
            seasonalItemsStartingId: 1000,
            itemImageUrl: "http://cdn.dota2.com/apps/dota2/images/items/%s",
            itemImageMap: {"259":"trident_lg.png?3"},
            getItemKey: function (rawKey) {
                return rawKey.replace(/[^A-Za-z0-9]+/g, "").toLowerCase();
            },
            update: function () {
                var self = this;
                if (self.initialized === true) {
                    return;
                }

                $.when(
                    $.ajax({
                        url: "https://www.dota2.com/jsfeed/itemdata?l=english",
                        dataType: "jsonp",
                        cache: false,
                        success: function (content) {
                            $.each(content.itemdata, function (index, value) {
                                // skip seasonal items
                                if (value.id < self.seasonalItemsStartingId) {

                                    // handle items general information
                                    var key = self.getItemKey(index);
                                    if (self.items[key] === undefined) {
                                        self.items[key] = {};
                                    }

                                    self.items[key].key = key;
                                    self.items[key].id = value.id;                                   
                                    self.items[key].name = value.dname;
                                    self.items[key].quality = value.qual;
                                    self.items[key].qualitycss = value.qual;

                                    // fix data bug
                                    if (self.items[key].quality === "secret_shop") {
                                        self.items[key].quality = "secret shop";
                                        self.items[key].qualitycss = "secret-shop";
                                    }
                                    // fix data bug
                                    if (self.items[key].quality === false) {
                                        self.items[key].quality = "component";
                                        self.items[key].qualitycss = "component";
                                    }
                                    self.items[key].cost = value.cost;
                                    self.items[key].description = value.desc;
                                    self.items[key].notes = value.notes;
                                    self.items[key].attributesHtml = value.attrib;
                                    self.items[key].manaCost = value.mc;
                                    self.items[key].cooldown = value.cd;
                                    self.items[key].lore = value.lore;
                                    self.items[key].created = value.created;

                                    // handle components
                                    if (value.components !== null) {
                                        self.items[key].components = [];
                                        $.each(value.components, function (index, componentValue) {
                                            if (typeof componentValue === 'string' || componentValue instanceof String) {
                                                var componentKey = self.getItemKey(componentValue);

                                                // only interested in non recipe (recipe will be handle later)
                                                if (componentKey.indexOf(self.recipeKey) === -1) {
                                                    self.items[key].components.push(componentKey);
                                                }
                                            }
                                        });
                                    }

                                    // images
                                    var image = new Image();
                                    if (self.itemImageMap[value.id] !== undefined) {
                                        image.src = sprintf(self.itemImageUrl, self.itemImageMap[value.id]);    
                                    }
                                    else {
                                        image.src = sprintf(self.itemImageUrl, value.img);
                                    }
                                    
                                    self.items[key].image = image.src;
                                }
                            });

                            // handle recipe information
                            for (var key in self.items) {
                                if (self.items.hasOwnProperty(key)) {
                                    // only need to worry about items created
                                    if (self.items[key].created) {
                                        // check if we need a recipe (if material cost is less than total cost)
                                        var materialCost = 0;
                                        $.each(self.items[key].components, function (index, componentKey) {
                                            materialCost = materialCost + self.items[componentKey].cost;
                                        });
                                        var recipeCost = self.items[key].cost - materialCost;
                                        if (recipeCost > 0) {
                                            var itemRecipeKey = self.recipeKey + key;
                                            if (self.items[itemRecipeKey] === undefined) {
                                                self.items[itemRecipeKey] = {};
                                            }
                                            self.items[itemRecipeKey].id = 0;
                                            self.items[itemRecipeKey].key = itemRecipeKey;
                                            self.items[itemRecipeKey].image = sprintf(self.itemImageUrl, self.recipeImage);
                                            self.items[itemRecipeKey].name =
                                                self.recipeName + " " + self.items[key].name;
                                            self.items[itemRecipeKey].quality = "";
                                            self.items[itemRecipeKey].cost = recipeCost;
                                            self.items[itemRecipeKey].description = "";
                                            self.items[itemRecipeKey].notes = "";
                                            self.items[itemRecipeKey].attributesHtml = "";
                                            self.items[itemRecipeKey].manaCost = 0;
                                            self.items[itemRecipeKey].cooldown = 0;
                                            self.items[itemRecipeKey].lore = "";
                                            self.items[itemRecipeKey].created = false;
                                            self.items[key].components.push(itemRecipeKey);
                                        }
                                    }
                                }
                            }
                        }
                    })
                ).then(function () {
                    // we want the keys in alpha order
                    var displayItems = [];
                    for (var key in self.items) {
                        if (self.items.hasOwnProperty(key)) {
                            if (self.ignoredItemIds.indexOf(self.items[key].id) === -1)
                                displayItems.push(self.items[key]);
                        }
                    }

                    // so we sort the keys
                    displayItems.sort(function (k1, k2) {
                        return k1.name.localeCompare(k2.name);
                    });

                    // iterate through the "dictionary" with sorted keys
                    for (var k = 0; k < displayItems.length; ++k) {
                        var template = document.createElement("div");
                        var item = displayItems[k];
                        var listItem = sprintf(
                            '<ons-list-item tappable><div class="left"><img class="list__item__thumbnail item-portrait" src="%s"/></div><div class="center"><span class="list__item__title item-name">%s</span><span class="list__item__subtitle"><img class="item-gold-icon" src="%s"></image><span class="item-caption item-gold-text">%s</span></span><span class="list__item__subtitle"><span class="item-caption item-%s-text">%s</span></span></div></ons-list-item>',
                            item.image, item.name, self.goldLocalImage, item.cost, item.qualitycss, item.quality);
                        template.innerHTML = listItem;
                        var first = template.firstChild;
                        first.addEventListener("click", function (wrapItem) {
                            return function () {
                                document.querySelector('#navigatorcontrol').pushPage('pages/itemdetails.html',
                                {
                                    data: {
                                        element: wrapItem
                                    }
                                });
                            };
                        }(item));
                        document.querySelector("#items-list").appendChild(template);
                    }

                    document.querySelector("#itemsprogressbar").style.visibility = "hidden";
                    self.initialized = true;
                });
            }
        }
    };
})();