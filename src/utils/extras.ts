import GuildDB from '../database/models/guild.js';
import levels from '../database/models/levels.js';
import Schema from '../database/models/logChannels.js';
import Stats from '../database/models/stats.js';
import ticketChannels from '../database/models/ticketChannels.js';
import ticketSchema from '../database/models/tickets.js';
import embeds from './embed.js';
import { InfluxDB } from '@influxdata/influxdb-client';
import { AeonaBot } from './types.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Channel,
  CommandInteraction,
  EmbedBuilder,
  Interaction,
  MessageActionRowComponentBuilder,
  Role,
  TextChannel,
} from 'discord.js';
import { SimpleCommandMessage } from 'discordx';
import { createTranscript } from 'discord-html-transcripts';
import { Pagination, PaginationType } from '@discordx/pagination';

const INFLUX_ORG = process.env.INFLUX_ORG as string;
const INFLUX_BUCKET = process.env.INFLUX_BUCKET as string;
const INFLUX_TOKEN = process.env.INFLUX_TOKEN as string;
const INFLUX_URL = process.env.INFLUX_URL as string;
const influxDB = INFLUX_URL && INFLUX_TOKEN ? new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN }) : undefined;

export function additionalProps(client: AeonaBot) {
  return {
    version: 'v0.2.0',
    ...embeds(client),
    influxQuery: influxDB?.getQueryApi(INFLUX_ORG),
    influx: influxDB?.getWriteApi(INFLUX_ORG, INFLUX_BUCKET),
    startTime: new Date().getTime(),
    messageCount: 0,
    capitalizeFirstLetter: (string: string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    buttonReactions(reactions: string[],ids:string[]) {
      const labels: ButtonBuilder[] = [];
      let comp: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];

      reactions.map((emoji:string,i) => {
        const btn = new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(`${emoji}`)
          .setCustomId(`reaction_button-${ids[i]}`);
        return labels.push(btn);
      });

      if (labels.length < 5 || labels.length == 5) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        row.addComponents(labels.slice(0, 5));

        comp = [row];
      }

      if ((labels.length < 10 && labels.length > 5) || labels.length == 10) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        row.addComponents(labels.slice(0, 5));
        row2.addComponents(labels.slice(5, 10));

        comp = [row, row2];
      }

      if ((labels.length < 15 && labels.length > 10) || labels.length == 15) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row3 = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        row.addComponents(labels.slice(0, 5));
        row2.addComponents(labels.slice(5, 10));
        row3.addComponents(labels.slice(10, 15));

        comp = [row, row2, row3];
      }

      if ((labels.length < 20 && labels.length > 15) || labels.length == 20) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row3 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row4 = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        row.addComponents(labels.slice(0, 5));
        row2.addComponents(labels.slice(5, 10));
        row3.addComponents(labels.slice(10, 15));
        row4.addComponents(labels.slice(15, 20));

        comp = [row, row2, row3, row4];
      }

      if ((labels.length < 25 && labels.length > 20) || labels.length == 25) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row3 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row4 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        const row5 = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        row.addComponents(labels.slice(0, 5));
        row2.addComponents(labels.slice(5, 10));
        row3.addComponents(labels.slice(10, 15));
        row4.addComponents(labels.slice(15, 20));
        row5.addComponents(labels.slice(20, 25));

        comp = [row, row2, row3, row4, row5];
      }

      return comp;
    },
    async getLogs(guildId: any) {
      const data = await Schema.findOne({ Guild: guildId });
      if (data && data.Channel) {
        const channel = await client.channels.cache.get(data.Channel);
        return channel;
      }
      return false;
    },
    async isPremium(guildId: string) {
      let guildDB = await GuildDB.findOne({ Guild: `${guildId}` });
      if (!guildDB)
        guildDB = new GuildDB({
          Guild: `${guildId}`,
        });
      return guildDB.isPremium === 'true';
    },
    async createChannelSetup(Schema: any, channel: Channel, interaction: CommandInteraction | SimpleCommandMessage) {
      Schema.findOne(
        {
          Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
        },
        async (err: any, data: { Channel: string; save: () => void }) => {
          if (data) {
            data.Channel = channel.id;
            data.save();
          } else {
            new Schema({
              Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
              Channel: `${channel.id}`,
            }).save();
          }
        },
      );

      client.extras.embed(
        {
          title: 'Successful!',
          desc: `Channel has been set up successfully! \n **[To learn how to use me read my documentation](https://docs.aeona.xyz/)**`,
          fields: [
            {
              name: `<:channel:1049292166343688192> Channel`,
              value: `<#${channel.id}> (${channel.id})`,
            },
          ],
          type: 'reply',
        },
        interaction,
      );
    },
    async createRoleSetup(Schema: any, role: Role, interaction: CommandInteraction | SimpleCommandMessage) {
      Schema.findOne(
        {
          Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
        },
        async (err: any, data: { Role: string; save: () => void }) => {
          if (data) {
            data.Role = role.id;
            data.save();
          } else {
            new Schema({
              Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
              Role: `${role.id}`,
            }).save();
          }
        },
      );

      client.extras.embed(
        {
          title: `Successful`,
          desc: `Role has been set up successfully!`,
          fields: [
            {
              name: `<:role:1062978537436491776> Role`,
              value: `<@&${role.id}> (${role.id})`,
            },
          ],
          type: 'reply',
        },
        interaction,
      );
    },
    async generateEmbed(start: any, lb: any[], title: any) {
      const current = lb.slice(start, start + 10);
      const result = current.join('\n');

      const embed = client.extras.templateEmbed().setTitle(`${title}`).setDescription(`${result.toString()}`);

      return embed;
    },

    async createLeaderboard(title: any, lb: any[], interaction: SimpleCommandMessage | CommandInteraction) {
      const embeds: EmbedBuilder[] = [];

      for (let i = 0; i < lb.length; i += 10) {
        embeds.push(await this.generateEmbed(i, lb, title));
      }

      const pagination = new Pagination(
        interaction instanceof CommandInteraction ? interaction : interaction.message,
        embeds.map((e) => {
          return { embeds: [e] };
        }),
        {
          type: PaginationType.SelectMenu,
          showStartEnd: false,
          idle: 1000 * 60 * 20,
          pageText: embeds.map((e, index) => `${index * 10 + 1} - ${index * 10 + 10}`),
        },
      );

      pagination.send();
    },
    getTemplate: async (guild: string) => {
      try {
        const data = await Stats.findOne({ Guild: `${guild}` });

        if (data && data.ChannelTemplate) {
          return data.ChannelTemplate;
        }
        return `{emoji} {name}`;
      } catch {
        return `{emoji} {name}`;
      }
    },
    async getTicketData(interaction: CommandInteraction | SimpleCommandMessage) {
      const ticketData = await ticketSchema.findOne({
        Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
      });
      if (!ticketData) return false;

      return ticketData;
    },

    async getChannelTicket(interaction: CommandInteraction | SimpleCommandMessage) {
      const ticketChannelData = await ticketChannels.findOne({
        Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
        channelID: `${
          interaction instanceof CommandInteraction ? interaction.channelId : interaction.message.channelId
        }`,
      });
      return ticketChannelData;
    },

    async isTicket(interaction: CommandInteraction | SimpleCommandMessage) {
      const ticketChannelData = await ticketChannels.findOne({
        Guild: interaction instanceof CommandInteraction ? interaction.guildId : interaction.message.guildId,
        channelID: `${
          interaction instanceof CommandInteraction ? interaction.channelId : interaction.message.channelId
        }`,
      });

      if (ticketChannelData) {
        return true;
      }
      return false;
    },

    async transcript(client: AeonaBot, channel: TextChannel) {
      const file = await createTranscript(channel, {
        footerText: 'Transcript by Aeona',
        poweredBy: false,
      });

      channel.send({
        files: [file],
      });
    },
    async setXP(userId: string, guildId: string, xp: number) {
      let user = await levels.findOne({ User: userId, Guild: guildId });
      if (!user) {
        user = new levels({
          User: userId,
          Guild: guildId,
          level: 0,
          xp: 0,
        });
      }

      user.xp = xp;
      user.level = Math.floor(0.1 * Math.sqrt(user.xp));
      user.lastUpdated = new Date();

      user.save();

      return user;
    },

    async setLevel(userId: string, guildId: string, level: number) {
      let user = await levels.findOne({ User: userId, Guild: guildId });
      if (!user) {
        user = new levels({
          User: userId,
          Guild: guildId,
          level: 0,
          xp: 0,
        });
      }

      user.level = level;
      user.xp = level * level * 100;
      user.lastUpdated = new Date();

      user.save();

      return user;
    },
    async addXP(userId: string, guildId: string, xp: number) {
      const user = await levels.findOne({ User: userId, Guild: guildId });

      if (!user) {
        let u = new levels({
          User: userId,
          Guild: guildId,
          xp,
          level: Math.floor(0.1 * Math.sqrt(xp)),
        });

        u.save();
        return { ...u, leveledUp: false };
      }

      user.xp += xp;
      user.level = Math.floor(0.1 * Math.sqrt(user.xp));
      user.lastUpdated = new Date();

      await user.save();

      return { ...user, leveledUp: Math.floor(0.1 * Math.sqrt((user.xp -= xp))) < user.level };
    },

    async addLevel(userId: string, guildId: string, level: string) {
      let user = await levels.findOne({ User: userId, Guild: guildId });
      if (!user) {
        user = new levels({
          User: userId,
          Guild: guildId,
          level: 0,
          xp: 0,
        });
      }

      user.level += parseInt(level, 10);
      user.xp = user.level * user.level * 100;
      user.lastUpdated = new Date();

      user.save();

      return user;
    },

    async fetchLevels(userId: string, guildId: string, fetchPosition = true) {
      let user = await levels.findOne({
        User: userId,
        Guild: guildId,
      });

      if (!user) {
        user = new levels({
          User: userId,
          Guild: guildId,
          level: 0,
          xp: 0,
        });
      }
      const userReturn = {
        // @ts-ignore
        ...user!._doc,
        position: 0,
        cleanXp: 0,
        cleanNextLevelXp: 0,
      };
      if (fetchPosition === true) {
        const leaderboard = await levels
          .find({
            Guild: guildId,
          })
          .sort([['xp', -1]])
          .exec();

        userReturn.position = leaderboard.findIndex((i) => i.User === `${userId}`) + 1;
      }

      userReturn.cleanXp = user.xp - client.extras.xpFor(user.level);
      userReturn.cleanNextLevelXp = client.extras.xpFor(user.level + 1) - client.extras.xpFor(user.level);
      return userReturn;
    },

    xpFor(targetLevel: number) {
      return targetLevel * targetLevel * 100;
    },

    wordlist: `Airplane
    Ears
    Piano
    Angry
    Elephant
    Pinch
    Baby
    Fish
    Reach
    Ball
    Flick
    Remote
    Baseball
    Football
    Roll
    Basketball
    Fork
    Sad
    Bounce
    Giggle
    Scissors
    Cat
    Golf
    Skip
    Chicken
    Guitar
    Sneeze
    Chimpanzee
    Hammer
    Spin
    Clap
    Happy
    Spoon
    Cough
    Horns
    Stomp
    Cry
    Joke
    Stop
    Dog
    Mime
    Tail
    Drink
    Penguin
    Toothbrush
    Drums
    Phone
    Wiggle
    Duck
    Photographer
    a
    ability
    able
    about
    above
    accept
    according
    account
    across
    act
    action
    activity
    actually
    add
    address
    administration
    admit
    adult
    affect
    after
    again
    against
    age
    agency
    agent
    ago
    agree
    agreement
    ahead
    air
    all
    allow
    almost
    alone
    along
    already
    also
    although
    always
    American
    among
    amount
    analysis
    and
    animal
    another
    answer
    any
    anyone
    anything
    appear
    apply
    approach
    area
    argue
    arm
    around
    arrive
    art
    article
    artist
    as
    ask
    assume
    at
    attack
    attention
    attorney
    audience
    author
    authority
    available
    avoid
    away
    baby
    back
    bad
    bag
    ball
    bank
    bar
    base
    be
    beat
    beautiful
    because
    become
    bed
    before
    begin
    behavior
    behind
    believe
    benefit
    best
    better
    between
    beyond
    big
    bill
    billion
    bit
    black
    blood
    blue
    board
    body
    book
    born
    both
    box
    boy
    break
    bring
    brother
    budget
    build
    building
    business
    but
    buy
    by
    call
    camera
    campaign
    can
    cancer
    candidate
    capital
    car
    card
    care
    career
    carry
    case
    catch
    cause
    cell
    center
    central
    century
    certain
    certainly
    chair
    challenge
    chance
    change
    character
    charge
    check
    child
    choice
    choose
    church
    citizen
    city
    civil
    claim
    class
    clear
    clearly
    close
    coach
    cold
    collection
    college
    color
    come
    commercial
    common
    community
    company
    compare
    computer
    concern
    condition
    conference
    Congress
    consider
    consumer
    contain
    continue
    control
    cost
    could
    country
    couple
    course
    court
    cover
    create
    crime
    cultural
    culture
    cup
    current
    customer
    cut
    dark
    data
    daughter
    day
    dead
    deal
    death
    debate
    decade
    decide
    decision
    deep
    defense
    degree
    Democrat
    democratic
    describe
    design
    despite
    detail
    determine
    develop
    development
    die
    difference
    different
    difficult
    dinner
    direction
    director
    discover
    discuss
    discussion
    disease
    do
    doctor
    dog
    door
    down
    draw
    dream
    drive
    drop
    drug
    during
    each
    early
    east
    easy
    eat
    economic
    economy
    edge
    education
    effect
    effort
    eight
    either
    election
    else
    employee
    end
    energy
    enjoy
    enough
    enter
    entire
    environment
    environmental
    especially
    establish
    even
    evening
    event
    ever
    every
    everybody
    everyone
    everything
    evidence
    exactly
    example
    executive
    exist
    expect
    experience
    expert
    explain
    eye
    face
    fact
    factor
    fail
    fall
    family
    far
    fast
    father
    fear
    federal
    feel
    feeling
    few
    field
    fight
    figure
    fill
    film
    final
    finally
    financial
    find
    fine
    finger
    finish
    fire
    firm
    first
    fish
    five
    floor
    fly
    focus
    follow
    food
    foot
    for
    force
    foreign
    forget
    form
    former
    forward
    four
    free
    friend
    from
    front
    full
    fund
    future
    game
    garden
    gas
    general
    generation
    get
    girl
    give
    glass
    go
    goal
    good
    government
    great
    green
    ground
    group
    grow
    growth
    guess
    gun
    guy
    hair
    half
    hand
    hang
    happen
    happy
    hard
    have
    he
    head
    health
    hear
    heart
    heat
    heavy
    help
    her
    here
    herself
    high
    him
    himself
    his
    history
    hit
    hold
    home
    hope
    hospital
    hot
    hotel
    hour
    house
    how
    however
    huge
    human
    hundred
    husband
    I
    idea
    identify
    if
    image
    imagine
    impact
    important
    improve
    in
    include
    including
    increase
    indeed
    indicate
    individual
    industry
    information
    inside
    instead
    institution
    interest
    interesting
    international
    interview
    into
    investment
    involve
    issue
    it
    item
    its
    itself
    job
    join
    just
    keep
    key
    kid
    kill
    kind
    kitchen
    know
    knowledge
    land
    language
    large
    last
    late
    later
    laugh
    law
    lawyer
    lay
    lead
    leader
    learn
    least
    leave
    left
    leg
    legal
    less
    let
    letter
    level
    lie
    life
    light
    like
    likely
    line
    list
    listen
    little
    live
    local
    long
    look
    lose
    loss
    lot
    love
    low
    machine
    magazine
    main
    maintain
    major
    majority
    make
    man
    manage
    management
    manager
    many
    market
    marriage
    material
    matter
    may
    maybe
    me
    mean
    measure
    media
    medical
    meet
    meeting
    member
    memory
    mention
    message
    method
    middle
    might
    military
    million
    mind
    minute
    miss
    mission
    model
    modern
    moment
    money
    month
    more
    morning
    most
    mother
    mouth
    move
    movement
    movie
    Mr
    Mrs
    much
    music
    must
    my
    myself
    name
    nation
    national
    natural
    nature
    near
    nearly
    necessary
    need
    network
    never
    new
    news
    newspaper
    next
    nice
    night
    no
    none
    nor
    north
    not
    note
    nothing
    notice
    now
    n't
    number
    occur
    of
    off
    offer
    office
    officer
    official
    often
    oh
    oil
    ok
    old
    on
    once
    one
    only
    onto
    open
    operation
    opportunity
    option
    or
    order
    organization
    other
    others
    our
    out
    outside
    over
    own
    owner
    page
    pain
    painting
    paper
    parent
    part
    participant
    particular
    particularly
    partner
    party
    pass
    past
    patient
    pattern
    pay
    peace
    people
    per
    perform
    performance
    perhaps
    period
    person
    personal
    phone
    physical
    pick
    picture
    piece
    place
    plan
    plant
    play
    player
    PM
    point
    police
    policy
    political
    politics
    poor
    popular
    population
    position
    positive
    possible
    power
    practice
    prepare
    present
    president
    pressure
    pretty
    prevent
    price
    private
    probably
    problem
    process
    produce
    product
    production
    professional
    professor
    program
    project
    property
    protect
    prove
    provide
    public
    pull
    purpose
    push
    put
    quality
    question
    quickly
    quite
    race
    radio
    raise
    range
    rate
    rather
    reach
    read
    ready
    real
    reality
    realize
    really
    reason
    receive
    recent
    recently
    recognize
    record
    red
    reduce
    reflect
    region
    relate
    relationship
    religious
    remain
    remember
    remove
    report
    represent
    Republican
    require
    research
    resource
    respond
    response
    responsibility
    rest
    result
    return
    reveal
    rich
    right
    rise
    risk
    road
    rock
    role
    room
    rule
    run
    safe
    same
    save
    say
    scene
    school
    science
    scientist
    score
    sea
    season
    seat
    second
    section
    security
    see
    seek
    seem
    sell
    send
    senior
    sense
    series
    serious
    serve
    service
    set
    seven
    several
    sex
    sexual
    shake
    share
    she
    shoot
    short
    shot
    should
    shoulder
    show
    side
    sign
    significant
    similar
    simple
    simply
    since
    sing
    single
    sister
    sit
    site
    situation
    six
    size
    skill
    skin
    small
    smile
    so
    social
    society
    soldier
    some
    somebody
    someone
    something
    sometimes
    son
    song
    soon
    sort
    sound
    source
    south
    southern
    space
    speak
    special
    specific
    speech
    spend
    sport
    spring
    staff
    stage
    stand
    standard
    star
    start
    state
    statement
    station
    stay
    step
    still
    stock
    stop
    store
    story
    strategy
    street
    strong
    structure
    student
    study
    stuff
    style
    subject
    success
    successful
    such
    suddenly
    suffer
    suggest
    summer
    support
    sure
    surface
    system
    table
    take
    talk
    task
    tax
    teach
    teacher
    team
    technology
    television
    tell
    ten
    tend
    term
    test
    than
    thank
    that
    the
    their
    them
    themselves
    then
    theory
    there
    these
    they
    thing
    think
    third
    this
    those
    though
    thought
    thousand
    threat
    three
    through
    throughout
    throw
    thus
    time
    to
    today
    together
    tonight
    too
    top
    total
    tough
    toward
    town
    trade
    traditional
    training
    travel
    treat
    treatment
    tree
    trial
    trip
    trouble
    true
    truth
    try
    turn
    TV
    two
    type
    under
    understand
    unit
    until
    up
    upon
    us
    use
    usually
    value
    various
    very
    victim
    view
    violence
    visit
    voice
    vote
    wait
    walk
    wall
    want
    war
    watch
    water
    way
    we
    weapon
    wear
    week
    weight
    well
    west
    western
    what
    whatever
    when
    where
    whether
    which
    while
    white
    who
    whole
    whom
    whose
    why
    wide
    wife
    will
    win
    wind
    window
    wish
    with
    within
    without
    woman
    wonder
    word
    work
    worker
    world
    worry
    would
    write
    writer
    wrong
    yard
    yeah
    year
    yes
    yet
    you
    young
    your
    yourself`.split('\n'),
  };
}
