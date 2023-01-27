const input = require('prompt-sync')({sigint: true});

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
function print(x) {
  console.log(x);
}

function clear() {
  console.log("clear");
  process.stdout.write("\u001b[2J\u001b[0;0H");
}

function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}


var bhealthmax, bosshp, bturn, crit, critchance, critdmg, damagedealt, damagetaken, defended, hp, maxhealth, play, plusbhp, plushp, prompt;

var critchanceUnAdded = [];

// modifiers

//chance to crit =
for (let i = 0; i < 10; i++) {
  critchanceUnAdded.push(getRandomIntInclusive(0, 10));
};
critchance = (critchanceUnAdded.reduce(function(a, b){
  return a + b;
}))/2
//crit multiplier
crit = 2;
//chance to defend
defended = getRandomIntInclusive(0, 6);
//maximum health
maxhealth = 35;
//maximum boss health
bhealthmax = 50;



function menu() {

  //Displays the health and options 
	//in this case attack,defend and heal

  print(`Your Health: ${hp}`);
  wait(1000);
  console.log(`Enemy Health: ${bosshp}`);
  wait(1000);
  console.log("\n[Attack] - Damages the enemy.\n[Defend] - Chance to block enemies attack.\n[Heal] - Regain some of your health.\n\n");
}

//attacks enemy
function attack() {

  clear();
  wait(200)
  console.log("You attack the enemy. \n");

  // sets critdmg to 1 so it has no effect 
  critdmg = 1;

  wait(1000);

  // checks to see if you got a crit
  if (critchance === 10) {

    // #damagedealt is multiplied by crit
    critdmg = damagedealt * crit;
  }

  // displays damage dealt
  console.log(`You dealt ${damagedealt * critdmg} damage.\n`);
  return damagedealt * critdmg;
}

function defend() {
  clear();
  wait(200);
  //displays the output for defending
  console.log("You prepare your defences. \n");
}

function heal() {
  clear();
  wait(200);
  console.log("You wrap yourself in bandages. \n");
  wait(1000);

  //adds plushp to your health
  console.log(`You gained ${plushp} health. \n`);
}

function battack() {
  //enemies turn to attack
  clear();
  wait(200);
  console.log("The Boss attacks you. \n");
  wait(1000);

  //checks to see if you defended the attack

  if (prompt === "DEFEND") {
    //if you used defend, nothing will happen
    console.log("You deflected the attack. \n");

  } else {
    //if you didn't it will deal damage
    console.log(`You take ${damagetaken} damage. \n`);
  }
}

function bdefend() {
  //enemies turn to defend
  clear();
  wait(200);

  //checks to see if you attacked
  if (prompt === "ATTACK") {
    //if you did attack, nothing will happen
    console.log("The Boss deflected your attack. \n");
  } else {
    //if you didn't, the boss's defence will fail
    console.log("The Boss tried to deflect you attack...\n");
    wait(1000);
    clear();
    console.log("... but it failed");
  }
}

function bheal() {
  //enemies turn to heal
  clear();
  wait(200);
  //regains the enemies health by plushp
  console.log(`The Boss regained ${plusbhp} health. \n`);
}

//main
play = true;
hp = 20;
bosshp = 50;

while (play === true) {
  //random chances

	//decides enemies move
  bturn = getRandomIntInclusive(1, 6);

	//decides how much damage you deal
  damagedealt = getRandomIntInclusive(2, 10);

	//decides how much hp you heal
  plushp = getRandomIntInclusive(5, 12);

	//decides how much hp the boss heals
  plusbhp = getRandomIntInclusive(3, 7);

	//decides how much damage you take
  damagetaken = getRandomIntInclusive(1, 8);

	//checks to see if anyoone is dead
  if (hp > 0 || bosshp > 0) {

    //makes sure you are alive
    if (hp > 0) {
      menu();

      //player chooses what to do
      prompt = input().toUpperCase();

      //if the player chooses to attack
      if (prompt === "ATTACK") {
        if (bturn !== 5) {
          //enemies health is subtracted by attack()
          bosshp = bosshp - attack();
        }

        wait(1000);

      //if the player chooses to defend
      } else {
        if (prompt === "DEFEND") {
          //uses defend() to ouput text
          defend();
          wait(1000);

        //if the player chooses to heal
        } else {
          if (prompt === "HEAL") {
            clear();
            //uses heal() to output text
            heal();
            //sets new health
            hp = hp + plushp;
            //checks if the player's health is bigger than the max
            if (hp > maxhealth) {
              //if it is bigger, player's health is set to the max
              hp = maxhealth;
            }

            wait(1000);
          } else {
            if (prompt === "DEBUG") {
              clear();

              console.log()
            }
          }
        }
      }
    //if player's health is <=0 the loop will end
    } else {
      break;
    }

    //checks if the boss is dead
    if (bosshp > 0) {
      //if not, it checks to see what move the boss will make
      //also, there is a 4/6 chance to attack
      if (bturn < 5) {
        //uses battack() to output text
        battack();

        //if the player didn't previously choose to defend
        if (prompt !== "DEFEND") {
          //the player loses health
          hp = hp - damagetaken;
        }

        wait(1000);
        clear();

      // 1/6 chance to defend
      } else {
        if (bturn === 5) {
          //uses bdefend() to output text
          bdefend();
          wait(1000);

        // 1/6 chance to heal
        } else {
          if (bturn === 6) {
            //uses bheal() to ouput text
            bheal();

            //heals the boss
            bosshp = bosshp + plusbhp;

            //checks if enemies health is over the max
            if (bosshp > bhealthmax) {
              //if it is, bosshp is set to the max
              bosshp = bhealthmax;
            }

            wait(1000);
          }
        }
      }
    //if bosshp <= 0 loop will end
    } else {
      break;
    }
  } else {
    //loop will end if the player or boss dies
    play = false;
    break;
  }
}

console.log(`Your Health: ${hp}`);
console.log(`Enemy Health: ${bosshp}`);

//checks to see who has won

//if the boss has no health, You Win

if (bosshp <= 0) {
  console.log("You defeated the Boss!");
} else {
  if (hp <= 0) {
    console.log("You Died!");
  }
}
