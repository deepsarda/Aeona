module.exports = function (
  P1move,
  P1health,
  P1timeout,
  P2move,
  P2health,
  P2timeout
) {
  let P1success, P2success, P1damage, P2damage;

  P1timeout = [];
  P2timeout = [];

  // Both Players are defending.
  if (P1move === 3 && P2move === 3) {
    // For Player 1
    P1success = Math.random() >= this.options.defenseSuccessRateAgainstDefense;
    P1damage =
      Math.floor(Math.random() * this.options.maxDefense) +
      this.options.minDefense;
    P1damage *= P1success ? 1 : -1;
    P1health += P1damage;
    if (Math.random() >= this.options.defenseTimeoutRate) P1timeout = ["three"];

    // For Player 2
    P2success = Math.random() >= this.options.defenseSuccessRateAgainstDefense;
    P2damage =
      Math.floor(Math.random() * this.options.maxDefense) +
      this.options.minDefense;
    P2damage *= P2success ? 1 : -1;
    P2health += P2damage;
    if (Math.random() >= this.options.defenseTimeoutRate) P2timeout = ["three"];
  } // Player 1 is defending and Player 2 is attacking.
  else if (P1move === 3 && P2move !== 3) {
    // Player 1 Stuff
    P1success =
      P2move === 1
        ? Math.random() >= this.options.defenseSuccessRateAgainstMelee
        : Math.random() >= this.options.defenseSuccessRateAgainstRanged;
    if (Math.random() >= this.options.defenseTimeoutRate) P1timeout = ["three"];

    // Player 2 Stuff
    P2success = !P1success;
    P2damage = Math.floor(
      P2move === 1
        ? Math.random() * this.options.maxMelee + this.options.minMelee
        : Math.random() * this.options.maxRanged + this.options.minRanged
    );
    if (
      P2move === 1
        ? Math.random() >= this.options.meleeTimeoutRate
        : Math.random() >= this.options.rangedTimeoutRate
    )
      P2timeout = [P2move === 1 ? "one" : "two"];

    // Changing Health
    if (P1success) {
      P1damage = P2damage;
      P2health -= P1damage;
    } else {
      P1damage = P2damage;
      P1health -= P2damage;
    }
  } // Player 1 is attacking and Player 2 is defending.
  else if (P1move !== 3 && P2move === 3) {
    // Player 2 Stuff
    P2success =
      P1move === 1
        ? Math.random() >= this.options.defenseSuccessRateAgainstMelee
        : Math.random() >= this.options.defenseSuccessRateAgainstRanged;
    if (Math.random() >= this.options.defenseTimeoutRate) P2timeout = ["three"];

    // Player 1 Stuff
    P1success = !P2success;
    P1damage = Math.floor(
      P1move === 1
        ? Math.random() * this.options.maxMelee + this.options.minMelee
        : Math.random() * this.options.maxRanged + this.options.minRanged
    );
    if (
      P1move === 1
        ? Math.random() >= this.options.meleeTimeoutRate
        : Math.random() >= this.options.rangedTimeoutRate
    )
      P1timeout = [P1move === 1 ? "one" : "two"];

    // Changing Health
    if (P2success) {
      P2damage = P1damage;
      P1health -= P2damage;
    } else {
      P2damage = P1damage;
      P2health -= P2damage;
    }
  } // Both Players aren't' defending
  else {
    // Player 1 Stuff
    P1success =
      P1move === 1
        ? Math.random() >= this.options.meleeSuccessRate
        : Math.random() >= this.options.rangedSuccessRate;
    P1damage = Math.floor(
      P1move === 1
        ? Math.random() * this.options.maxMelee + this.options.minMelee
        : Math.random() * this.options.maxRanged + this.options.minRanged
    );
    if (
      P1move === 1
        ? Math.random() >= this.options.meleeTimeoutRate
        : Math.random() >= this.options.rangedTimeoutRate
    )
      P1timeout = [P1move === 1 ? "one" : "two"];

    // Player 2 Stuff
    P2success =
      P2move === 1
        ? Math.random() >= this.options.meleeSuccessRate
        : Math.random() >= this.options.rangedSuccessRate;
    P2damage = Math.floor(
      P2move === 1
        ? Math.random() * this.options.maxMelee + this.options.minMelee
        : Math.random() * this.options.maxRanged + this.options.minRanged
    );
    if (
      P2move === 1
        ? Math.random() >= this.options.meleeTimeoutRate
        : Math.random() >= this.options.rangedTimeoutRate
    )
      P2timeout = [P2move === 1 ? "one" : "two"];

    // Change Health
    if (P2success) P1health -= P2damage;
    else P2health -= P2damage;
    if (P1success) P2health -= P1damage;
    else P1health -= P1damage;
  }

  const data = {
    P1move,
    P1health,
    P1timeout,
    P2move,
    P2health,
    P2timeout,
    P1success,
    P2success,
    P1damage,
    P2damage,
  };

  return data;
};
