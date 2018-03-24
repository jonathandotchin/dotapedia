// app controllers
// these controllers contains all the initializations logics

(function () {
    "use strict";
    window.dotapedia.controllers = {

        // TabbarPage Controller
        tabbarpage: function (page) {
            // set the button functionality to open/close the menu
            page.querySelector('[component="button/menu"]').onclick = function () {
                document.querySelector('#splittercontrol').left.toggle();
            };

            // set the tab functionality to initialize tab content
            page.querySelector("ons-tabbar").addEventListener("prechange", function (e) {
                switch (e.index) {
                    case 0:
                        window.dotapedia.services.stats.update();
                        break;
                    case 1:
                        window.dotapedia.services.news.update();
                        break;
                    case 2:
                        window.dotapedia.services.updates.update();
                        break;
                    case 3:
                        window.dotapedia.services.heroes.update();
                        break;
                    case 4:
                        window.dotapedia.services.items.update();
                        break;
                }
            });
        },

        // MenuPage Controller
        menupage: function (page) {
            // set the button functionality to navigate push about page
            page.querySelector('[component="button/about"]').onclick = function () {
                document.querySelector('#navigatorcontrol').pushPage('pages/about.html');
            };

            // set the button functionality to navigate push contact us page
            page.querySelector('[component="button/contactus"]').onclick = function () {
                document.querySelector('#navigatorcontrol').pushPage('pages/contactus.html');
            };

            //// set the button functionality to navigate push rate this app page
            //page.querySelector('[component="button/ratethisapp"]').onclick = function () {
            //    document.querySelector('#navigatorcontrol').pushPage('pages/ratethisapp.html');
            //};

            //// set the button functionality to navigate push donate page
            //page.querySelector('[component="button/donate"]').onclick = function () {
            //    document.querySelector('#navigatorcontrol').pushPage('pages/donate.html');
            //};
        },

        // contact us page
        contactuspage: function(page) {
            page.querySelector('[component="button/contactus"]').onclick = function () {
                location.href = "mailto:?to=jonathancosupport@outlook.com&subject=Feedback%20on%20Dotapedia";
            };
        },

        // HeroOverviewPage Controller
        herooverviewpage: function (page) {
            var hero = page.ownerDocument.querySelector('#herodetailspage').data.element;
            page.querySelector('#hero-name').innerHTML = hero.name;
            page.querySelector('#hero-image').src = hero.mediumImage;
            page.querySelector('#hero-attack').innerHTML = hero.attack;
            var roles = "";
            for (var i = 0; i < hero.roles.length; i++) {
                roles += hero.roles[i];
                if (i !== hero.roles.length - 1) {
                    roles += " - ";
                }
            }

            // setup proper values
            page.querySelector('#hero-roles').innerHTML = roles;
            page.querySelector('#hero-overview-intelligence').innerHTML =
                hero.attribute.intelligence.base + " + " + hero.attribute.intelligence.gain;
            page.querySelector('#hero-overview-agility').innerHTML =
                hero.attribute.agility.base + " + " + hero.attribute.agility.gain;
            page.querySelector('#hero-overview-strength').innerHTML =
                hero.attribute.strength.base + " + " + hero.attribute.strength.gain;
            page.querySelector('#hero-overview-attack').innerHTML =
                hero.attribute.damage.minimum + " - " + hero.attribute.damage.maximum;
            page.querySelector('#hero-overview-speed').innerHTML = hero.attribute.movementSpeed;
            page.querySelector('#hero-overview-armor').innerHTML = hero.attribute.armor;

            // setup proper icons
            if (hero.attribute.intelligence.primary === true) {
                page.querySelector('#hero-overview-intelligence-primary-icon').style.display = 'inline';
                page.querySelector('#hero-overview-intelligence-icon').style.display = 'none';
            } else {
                page.querySelector('#hero-overview-intelligence-primary-icon').style.display = 'none';
                page.querySelector('#hero-overview-intelligence-icon').style.display = 'inline';
            }

            if (hero.attribute.agility.primary === true) {
                page.querySelector('#hero-overview-agility-primary-icon').style.display = 'inline';
                page.querySelector('#hero-overview-agility-icon').style.display = 'none';
            } else {
                page.querySelector('#hero-overview-agility-primary-icon').style.display = 'none';
                page.querySelector('#hero-overview-agility-icon').style.display = 'inline';
            }

            if (hero.attribute.strength.primary === true) {
                page.querySelector('#hero-overview-strength-primary-icon').style.display = 'inline';
                page.querySelector('#hero-overview-strength-icon').style.display = 'none';
            } else {
                page.querySelector('#hero-overview-strength-primary-icon').style.display = 'none';
                page.querySelector('#hero-overview-strength-icon').style.display = 'inline';
            }
        },

        // HeroBioPage Controller
        herobiopage: function (page) {
            var hero = page.ownerDocument.querySelector('#herodetailspage').data.element;
            page.querySelector('#hero-bio-text').innerHTML = hero.biography;
        },

        // HeroAbilitiesPage Controller
        heroabilitiespage: function (page) {
            var hero = page.ownerDocument.querySelector('#herodetailspage').data.element;
            hero.abilities.forEach(function (ability) {
                var template = document.createElement("ons-list-item");
                var item = sprintf(
                    '<div class="center"><div class="box"><div class="box-portrait"><img class="hero-ability-box-portrait-image" src="%s" /></div><div class="box-title"><div class="hero-ability-name">%s</div><div>%s</div></div></div><span class="list__item__subtitle"><p>%s</p><p>%s</p><div>%s</div><div>%s</div><div>%s</div><p class="lore-text">%s</p></span></div>',
                    ability.image, ability.name, ability.cooldownManaCostHtml, ability.description, ability.notesHtml, ability.affectsHtml, ability.damageHtml, ability.attributeHtml, ability.lore);
                template.innerHTML = item;
                page.querySelector("#heroes-abilities-list").appendChild(template);
            });
        },

        // ItemDetailsPage Controller
        itemdetailspage: function (page) {
            var item = page.data.element;

            // fill in the information
            page.querySelector('#itemimage').src = item.image;
            page.querySelector('#itemname').innerHTML = item.name;
            page.querySelector('#itemgoldimage').src = window.dotapedia.services.items.goldLocalImage;
            page.querySelector('#itemcost').innerHTML = item.cost;
            page.querySelector('#itemquality').innerHTML = item.quality;
            page.querySelector('#itemquality').classList.add("item-" + item.qualitycss + "-text");
            page.querySelector('#itemdescription').innerHTML = item.description;
            page.querySelector('#itemnotes').innerHTML = item.notes;
            page.querySelector('#itemattributes').innerHTML = item.attributesHtml;
            page.querySelector('#itemmanacostvalue').innerHTML = item.manaCost;
            page.querySelector('#itemcooldownvalue').innerHTML = item.cooldown;
            page.querySelector('#itemlore').innerHTML = item.lore;

            // hide the mana cost and/or cooldown depending of value
            if (item.manaCost === false) {
                page.querySelector('#itemmanacost').style.display = "none";
            }

            if (item.cooldown === false) {
                page.querySelector('#itemcooldown').style.display = "none";
            }
        }
    };
})();