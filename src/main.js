// 818630678
// 705273107
fetch(`http://localhost:3000/genshin/818630678`)
    .then(response => response.json())
    .then(genshin => profile(genshin));

function profile(genshin_data) {
    console.log(genshin_data);
    document.getElementById(`page_title`).textContent = `${genshin_data.player.username} | Profile`;

    let maxCharacters = genshin_data.player.showcase.length - 1;
    let current = 0;

    for (let i = 0; i < genshin_data.player.showcase.length; i++) {
        document.getElementById(`profile_character_${i}`).src = toEnkaLink(genshin_data.player.showcase[i].assets.icon);
        document.getElementById(`profile_character_${i}`).addEventListener("click", () => {
            showcase_character(genshin_data.characters[i], genshin_data);
            current = i;
        })
    }
    showcase_character(genshin_data.characters[0], genshin_data);

    // * arrow keys
    window.addEventListener('keydown', event => {
        if (event.key == "ArrowLeft") {
            if (current == 0) {
                current = maxCharacters;
                showcase_character(genshin_data.characters[maxCharacters], genshin_data);
            } else {
                current--;
                showcase_character(genshin_data.characters[current], genshin_data);
            }
        } else if (event.key == "ArrowRight") {
            if (current == maxCharacters) {
                current = 0;
                showcase_character(genshin_data.characters[current], genshin_data);
            } else {
                current++;
                showcase_character(genshin_data.characters[current], genshin_data);
            }
        }
    })
}

function showcase_character(character, genshin_data) {
    if (document.getElementById(`character_name`).textContent == character.name) { return; }

    console.log(character);

    document.getElementById(`card_background`).src = `assets/Backgrounds/${character.element}.png`;

    // * splash art
    if (character.costumeId != "") {
        document.getElementById(`gachaIcon`).src = toEnkaLink(character.assets.costumes[0].art);
    } else {
        document.getElementById(`gachaIcon`).src = toEnkaLink(character.assets.gachaIcon);
    }

    // * constellations
    const constellation = character.assets.constellations

    let elementColor = ``;
    switch (character.element) {
        case "Pyro":
            elementColor = `rgb(255, 153, 85)`;
            break;
        case "Hydro":
            elementColor = `rgb(62, 153, 255)`;
            break;
        case "Anemo":
            elementColor = `rgb(128, 255, 230)`;
            break;
        case "Electro":
            elementColor = `rgb(179, 128, 255)`;
            break;
        case "Dendro":
            elementColor = `rgb(134, 201, 119)`;
            break;
        case "Cryo":
            elementColor = `rgb(138, 169, 206)`;
            break;
        case "Geo":
            elementColor = `rgb(232, 186, 106)`;
            break;
    }

    for (let i = 0; i < constellation.length; i++) {
        document.getElementById(`constellation_${i}`).src = toEnkaLink(constellation[i]);
        document.getElementById(`constellation_${i}`).style.filter = "brightness(100%)";
        document.getElementById(`constellation_${i}`).style.border = `1px solid ${elementColor}`;
    }
    for (let index = 6; index > character.constellationsList.length; index--) {
        document.getElementById(`constellation_${index - 1}`).style.filter = "brightness(50%)";
    }


    // * character name, talent, weapon and signature
    document.getElementById(`character_name`).textContent = character.name;
    document.getElementById(`character_lvl`).textContent = `Lv. ${character.properties.level.val} /`;
    document.getElementById(`character_lvl_ascension`).textContent = character.maxLevel;
    document.getElementById(`character_friendship`).textContent = `Friendship Level ${character.friendship.level}`;

    // * talents
    // TODO: Add talent values
    const skill = character.skills;
    document.getElementById(`normalAttacks_icon`).src = toEnkaLink(skill.normalAttacks.assets.icon);
    document.getElementById(`normalAttacks_value`).textContent = `Lv. ${skill.normalAttacks.level}`;
    document.getElementById(`normalAttacks_name`).textContent = skill.normalAttacks.name;

    document.getElementById(`elementalSkill_icon`).src = toEnkaLink(skill.elementalSkill.assets.icon);
    document.getElementById(`elementalSkill_value`).textContent = `Lv. ${skill.elementalSkill.level}`;
    document.getElementById(`elementalSkill_name`).textContent = skill.elementalSkill.name;

    document.getElementById(`elementalBurst_icon`).src = toEnkaLink(skill.elementalBurst.assets.icon);
    document.getElementById(`elementalBurst_value`).textContent = `Lv. ${skill.elementalBurst.level}`;
    document.getElementById(`elementalBurst_name`).textContent = skill.elementalBurst.name;

    // * weapon
    const weapon = character.equipment.weapon;
    if (weapon.ascensionLevel >= 2) {
        document.getElementById(`weapon_icon`).src = toEnkaLink(weapon.assets.awakenIcon);
    } else {
        document.getElementById(`weapon_icon`).src = toEnkaLink(weapon.assets.icon);
    }
    document.getElementById(`weapon_name`).textContent = weapon.name;
    document.getElementById(`weapon_lvl`).textContent = `Lv. ${weapon.level} / `;
    document.getElementById(`weapon_lvl_phase`).textContent = getAscensionPhase(weapon.ascensionLevel);
    document.getElementById(`weapon_atk`).textContent = weapon.weaponStats[0].statValue;
    if (weapon.weaponStats[1]) {
        document.getElementById(`weapon_substat_name`).textContent = formatStatName(weapon.weaponStats[1].stat);
        document.getElementById(`weapon_substat`).textContent = formatStatValue(weapon.weaponStats[1].stat, weapon.weaponStats[1].statValue);
    } else {
        document.getElementById(`weapon_substat_name`).textContent = ``;
        document.getElementById(`weapon_substat`).textContent = ``;
    }
    document.getElementById(`weapon_refinement`).textContent = `R${weapon.refinement.level + 1}`;

    // * signature

    // get player region
    let region = ``;
    let uid = (genshin_data.uid.toString());
    if (uid.substring(0, 2) == 18) {
        region = "ASIA";
    } else {
        switch (uid.charAt(0)) {
            case "0":
                region = "MI";
                break;
            case "1":
            case "2":
            case "3":
            case "5":
                region = "CN";
                break;
            case "6":
                region = "NA";
                break;
            case "7":
                region = "EU";
                break;
            case "8":
                region = "ASIA";
                break;
            case "9":
                region = "TW";
                break;
        }
    }

    document.getElementById(`signature_profilePicture`).src = toEnkaLink(genshin_data.player.profilePicture.assets.icon);
    document.getElementById(`signature_name`).textContent = `${genshin_data.player.username} - ${region}`;
    document.getElementById(`signature_uid`).textContent = `UID: ${genshin_data.uid}`;
    document.getElementById(`signature_hoyo`).textContent = `Hoyo: ${genshin_data.uid / 2}`;

    // * stats
    // basic stat
    const stat = character.stats;
    // TODO: Add stat calculations
    document.getElementById(`maxHp`).textContent = `${formatBasicStat(stat.maxHp.value)} (${formatBasicStat(stat.baseHp.value)} + ${formatBasicStat(stat.maxHp.value - stat.baseHp.value)})`;
    document.getElementById(`atk`).textContent = `${formatBasicStat(stat.atk.value)} (${formatBasicStat(stat.baseAtk.value)} + ${formatBasicStat(stat.atk.value - stat.baseAtk.value)})`;
    document.getElementById(`def`).textContent = `${formatBasicStat(stat.def.value)} (${formatBasicStat(stat.baseDef.value)} + ${formatBasicStat(stat.def.value - stat.baseDef.value)})`;
    document.getElementById(`elementalMastery`).textContent = formatBasicStat(stat.elementalMastery.value);
    // advanced stat
    document.getElementById(`critRate`).textContent = formatAdvancedStat(stat.critRate.value);
    document.getElementById(`critDamage`).textContent = formatAdvancedStat(stat.critDamage.value);
    document.getElementById(`healingBonus`).textContent = formatAdvancedStat(stat.healingBonus.value);
    document.getElementById(`incomingHealingBonus`).textContent = formatAdvancedStat(stat.incomingHealingBonus.value);
    document.getElementById(`energyRecharge`).textContent = formatAdvancedStat(stat.energyRecharge.value);

    // TODO: Functionality for dynamic elemental damage bonus pathing for value and icon
    document.getElementById(`elementalDamageBonusName`).textContent = `${character.element} DMG Bonus`;
    document.getElementById(`elementalDamageBonus`).textContent = formatAdvancedStat(0);

    const artifactTypes = ["EQUIP_BRACER", "EQUIP_NECKLACE", "EQUIP_SHOES", "EQUIP_RING", "EQUIP_DRESS"]
    artifactTypes.forEach(artifact => {
        for (let index = 0; index < 4; index++) {
            document.getElementById(`${artifact}_Main_Icon`).src = ``;
            document.getElementById(`${artifact}_mainStat_Icon`).src = ``;
            document.getElementById(`${artifact}_Main_Value`).textContent = ``;
            document.getElementById(`${artifact}_Main_Lvl`).textContent = ``;
            for (let i = 0; i < 4; i++) {
                document.getElementById(`${artifact}_statIcon_${index}`).src = ``;
                document.getElementById(`${artifact}_stat_${index}`).textContent = ``;
                document.getElementById(`${artifact}_statValue_${index}`).textContent = ``;
            }
        }
    });

    // * artifacts
    const artifact = character.equipment.artifacts;
    for (let i = 0; i < character.equipment.artifacts.length; i++) {
        let artifact_type = artifact[i].equipType;
        document.getElementById(`${artifact_type}_Main_Icon`).src = toEnkaLink(artifact[i].icon);
        document.getElementById(`${artifact_type}_mainStat_Icon`).src = `assets/icons/${artifact[i].mainstat.stat}.svg`;
        document.getElementById(`${artifact_type}_Main_Value`).textContent = formatStatValue(artifact[i].mainstat.stat, artifact[i].mainstat.statValue);
        document.getElementById(`${artifact_type}_Main_Lvl`).textContent = `+${artifact[i].level - 1}`;
        for (let index = 0; index < artifact[i].substats.length; index++) {
            document.getElementById(`${artifact_type}_statIcon_${index}`).src = `assets/icons/${artifact[i].substats[index].stat}.svg`;
            document.getElementById(`${artifact_type}_stat_${index}`).textContent = formatStatName(artifact[i].substats[index].stat);
            document.getElementById(`${artifact_type}_statValue_${index}`).textContent = formatStatValue(artifact[i].substats[index].stat, artifact[i].substats[index].statValue);
        }
    }
}

function toEnkaLink(path) {
    return `https://enka.network/ui/${[path]}.png`
}

function formatBasicStat(statValue) {
    return Math.round(statValue).toLocaleString();
}

function formatAdvancedStat(statValue) {
    return `${(statValue * 100).toFixed(1)}%`;
}

function formatStatName(stat) {
    switch (stat) {
        case "FIGHT_PROP_HP":
            return "HP";
        case "FIGHT_PROP_HP_PERCENT":
            return "HP%";
        case "FIGHT_PROP_ATTACK":
            return "ATK";
        case "FIGHT_PROP_ATTACK_PERCENT":
            return "ATK%";
        case "FIGHT_PROP_DEFENSE":
            return "DEF";
        case "FIGHT_PROP_DEFENSE_PERCENT":
            return "DEF%";
        case "FIGHT_PROP_ELEMENT_MASTERY":
            return "EM";
        case "FIGHT_PROP_CRITICAL":
            return "CRIT Rate";
        case "FIGHT_PROP_CRITICAL_HURT":
            return "CRIT DMG";
        case "FIGHT_PROP_CHARGE_EFFICIENCY":
            return "ER%";
    }
}

function formatStatValue(stat, statValue) {
    switch (stat) {
        case "FIGHT_PROP_HP_PERCENT":
        case "FIGHT_PROP_ATTACK_PERCENT":
        case "FIGHT_PROP_DEFENSE_PERCENT":
        case "FIGHT_PROP_CRITICAL":
        case "FIGHT_PROP_CRITICAL_HURT":
        case "FIGHT_PROP_FIRE_ADD_HURT":
        case "FIGHT_PROP_WATER_ADD_HURT":
        case "FIGHT_PROP_WIND_ADD_HURT":
        case "FIGHT_PROP_ELEC_ADD_HURT":
        case "FIGHT_PROP_GRASS_ADD_HURT":
        case "FIGHT_PROP_ICE_ADD_HURT":
        case "FIGHT_PROP_ROCK_ADD_HURT":
            return `${statValue}%`;
        default:
            return statValue;
    }
}

function getAscensionPhase(ascensionLevel) {
    switch (ascensionLevel) {
        case "":
            return "20";
        case 1:
            return "40";
        case 2:
            return "50";
        case 3:
            return "60";
        case 4:
            return "70";
        case 5:
            return "80";
        case 6:
            return "90";
    }
}