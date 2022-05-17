class options {
  /**
   *
   * @param {Options} options The options for fighting game module.
   */
  constructor(options) {
    const {
      timeEndMessage = "{user} ran away from the battle",
      forceEndMessage = "{user} ended the game forcefully",
      startMessage = "The game has begun",
      midMessage = "Everyone chose their move, Current conditions :",
      endMessage = "Game ended, 👑 {winner} won",
      oneName = "Melee",
      oneEmoji = "⚔",
      twoName = "Ranged",
      twoEmoji = "🏹",
      threeName = "Defend",
      threeEmoji = "🛡",
      endName = "End Game",
      endEmoji = "❌",
      startHealth = 100,
      defenseSuccessRateAgainstDefense = 45,
      maxDefense = 15,
      minDefense = 3,
      maxMelee = 23,
      minMelee = 8,
      maxRanged = 18,
      minRanged = 8,
      defenseTimeoutRate = 30,
      meleeTimeoutRate = 20,
      meleeSuccessRate = 85,
      rangedTimeoutRate = 10,
      rangedSuccessRate = 70,
      defenseSuccessRateAgainstRanged = 50,
      defenseSuccessRateAgainstMelee = 40,
      moveTime = 30000,
    } = options;

    [
      startMessage,
      midMessage,
      endMessage,
      oneName,
      oneEmoji,
      twoName,
      twoEmoji,
      threeName,
      threeEmoji,
      endName,
      endEmoji,
    ].forEach((v) => {
      if (typeof v !== "string")
        throw new Error(`Invalid value : ${v}\nExpected a String`);
    });

    if (typeof startHealth !== "number" || startHealth < 1)
      throw new Error(
        "Invalid start health, it should be at least 1 but we got " +
          startHealth
      );

    [
      defenseSuccessRateAgainstDefense,
      maxDefense,
      minDefense,
      maxMelee,
      minMelee,
      maxRanged,
      minRanged,
      defenseTimeoutRate,
      meleeTimeoutRate,
      meleeSuccessRate,
      rangedTimeoutRate,
      rangedSuccessRate,
      defenseSuccessRateAgainstRanged,
      defenseSuccessRateAgainstMelee,
    ].forEach((v) => {
      if (typeof v !== "number" || v < 0 || v > 100)
        throw new Error(
          `Invalid Success rate was provided, it should be a number between 0.0 to 100.0`
        );
    });

    [
      [maxDefense, minDefense],
      [maxMelee, minMelee],
      [maxRanged, minRanged],
    ].forEach((v, i) => {
      if (v[0] < v[i])
        throw new Error(
          `Maximum ${
            i === 1 ? threeName : i === 2 ? oneName : twoName
          } attack points is less than their minimum point, Which is invalid`
        );
    });

    if (typeof moveTime !== "number" || moveTime < 1000)
      throw new Error(
        "Move time should be a number nd at least 1000 but we got " +
          JSON.stringify(moveTime)
      );

    this.moveTime = moveTime;
    this.startMessage = startMessage;
    this.midMessage = midMessage;
    this.endMessage = endMessage;
    this.forceEndMessage = forceEndMessage;
    this.timeEndMessage = timeEndMessage;
    this.oneName = oneName;
    this.oneEmoji = oneEmoji;
    this.twoName = twoName;
    this.twoEmoji = twoEmoji;
    this.threeName = threeName;
    this.threeEmoji = threeEmoji;
    this.endName = endName;
    this.endEmoji = endEmoji;
    this.startHealth = startHealth;
    this.defenseSuccessRateAgainstDefense =
      (100 - defenseSuccessRateAgainstDefense) / 100;
    this.defenseSuccessRateAgainstMelee =
      (100 - defenseSuccessRateAgainstMelee) / 100;
    this.defenseSuccessRateAgainstRanged =
      (100 - defenseSuccessRateAgainstRanged) / 100;
    this.defenseTimeoutRate = (100 - defenseTimeoutRate) / 100;
    this.maxDefense = maxDefense - minDefense;
    this.minDefense = minDefense;
    this.meleeSuccessRate = (100 - meleeSuccessRate) / 100;
    this.meleeTimeoutRate = (100 - meleeTimeoutRate) / 100;
    this.maxMelee = maxMelee - minMelee;
    this.minMelee = minMelee;
    this.rangedSuccessRate = (100 - rangedSuccessRate) / 100;
    this.rangedTimeoutRate = (100 - rangedTimeoutRate) / 100;
    this.maxRanged = maxRanged - minRanged;
    this.minRanged = minRanged;
  }
}

module.exports = options;

/**
 * @typedef {Object} Options The options of fighting module
 * @property {String} startMessage The message title during game's starting
 * @property {String} midMessage The message title when both user chose their move
 * @property {String} endMessage The message title at the end of the game
 * @property {String} forceEndMessage The message title when game is ended forcefully
 * @property {String} timeEndMessage The message title when user didn't responded to bot's DM
 * @property {String} oneName First move's name
 * @property {String} oneEmoji First move's emoji
 * @property {String} twoName Second move's name
 * @property {String} twoEmoji Second move's emoji
 * @property {String} threeName Third move's name
 * @property {String} threeEmoji Third move's emoji
 * @property {String} endName Game end's name
 * @property {String} endEmoji Game end's emoji
 * @property {Number} startHealth The starting health of players
 * @property {Number} defenseSuccessRateAgainstDefense Success rate of defending against enemy defending
 * @property {Number} defenseSuccessRateAgainstMelee Success rate of defending against enemy using melee move
 * @property {Number} defenseSuccessRateAgainstRanged Success rate of defending against enemy using ranged move
 * @property {Number} maxDefense Maximum defense points
 * @property {Number} minDefense Minimum defense points
 * @property {Number} defenseTimeoutRate Chances to get timeout to use defense move
 * @property {Number} maxMelee Maximum Melee points
 * @property {Number} minMelee Minimum Melee points
 * @property {Number} meleeSuccessRate Chances of Melee move success
 * @property {Number} meleeTimeoutRate Chances to get timeout to use melee move
 * @property {Number} maxRanged Maximum Ranged points
 * @property {Number} minRanged Minimum Ranged points
 * @property {Number} rangedTimeoutRate Chances to get timeout to use ranged move
 * @property {Number} rangedSuccessRate Chances of Ranged move success
 */
