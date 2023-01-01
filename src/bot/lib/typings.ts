declare module "hmfull" {
    const Manual: 'Example For All Libraries: await HMfull.HMtai.sfw.wallpaper() - { url: "link" }'
    const HMtai: HMtai
    const Nekos: Nekos
    const NekoLove: NekoLove
    const NekoBot: NekoBot
    interface Nekos {
        sfw: {
            pat(): Promise<HMfullResults>
            neko(): Promise<HMfullResults>
            kiss(): Promise<HMfullResults>
            hug(): Promise<HMfullResults>
            feed(): Promise<HMfullResults>
            cuddle(): Promise<HMfullResults>
            smug(): Promise<HMfullResults>
            tickle(): Promise<HMfullResults>
            foxgirl(): Promise<HMfullResults>
            waifu(): Promise<HMfullResults>
        }
        nsfw: {
            nekogif(): Promise<HMfullResults>
            wallpaper(): Promise<HMfullResults>
        }
    }

    interface NekoLove {
        sfw: {
            pat(): Promise<HMfullResults>
            hug(): Promise<HMfullResults>
            kiss(): Promise<HMfullResults>
            cry(): Promise<HMfullResults>
            slap(): Promise<HMfullResults>
            smug(): Promise<HMfullResults>
            punch(): Promise<HMfullResults>
            neko(): Promise<HMfullResults>
            kitsune(): Promise<HMfullResults>
            waifu(): Promise<HMfullResults>
        }
        nsfw: {
            nekolewd(): Promise<HMfullResults>
        }
    }

    interface NekoBot {
        sfw: {
            kanna(): Promise<HMfullResults>
            neko(): Promise<HMfullResults>
            holo(): Promise<HMfullResults>
            kemonomimi(): Promise<HMfullResults>
            coffee(): Promise<HMfullResults>
            gah(): Promise<HMfullResults>
        }
        nsfw: {
            hentai(): Promise<HMfullResults>
            ass(): Promise<HMfullResults>
            boobs(): Promise<HMfullResults>
            paizuri(): Promise<HMfullResults>
            yuri(): Promise<HMfullResults>
            thigh(): Promise<HMfullResults>
            lewdneko(): Promise<HMfullResults>
            midriff(): Promise<HMfullResults>
            kitsune(): Promise<HMfullResults>
            tentacle(): Promise<HMfullResults>
            anal(): Promise<HMfullResults>
            hanal(): Promise<HMfullResults>
            neko(): Promise<HMfullResults>
        }
    }

    interface HMtai {
        sfw: {
            wave(): Promise<HMfullResults>
            wink(): Promise<HMfullResults>
            tea(): Promise<HMfullResults>
            bonk(): Promise<HMfullResults>
            punch(): Promise<HMfullResults>
            poke(): Promise<HMfullResults>
            bully(): Promise<HMfullResults>
            pat(): Promise<HMfullResults>
            kiss(): Promise<HMfullResults>
            kick(): Promise<HMfullResults>
            blush(): Promise<HMfullResults>
            feed(): Promise<HMfullResults>
            smug(): Promise<HMfullResults>
            hug(): Promise<HMfullResults>
            cuddle(): Promise<HMfullResults>
            cry(): Promise<HMfullResults>
            slap(): Promise<HMfullResults>
            five(): Promise<HMfullResults>
            glomp(): Promise<HMfullResults>
            happy(): Promise<HMfullResults>
            hold(): Promise<HMfullResults>
            nom(): Promise<HMfullResults>
            smile(): Promise<HMfullResults>
            throw(): Promise<HMfullResults>
            lick(): Promise<HMfullResults>
            bite(): Promise<HMfullResults>
            dance(): Promise<HMfullResults>
            boop(): Promise<HMfullResults>
            sleep(): Promise<HMfullResults>
            like(): Promise<HMfullResults>
            kill(): Promise<HMfullResults>
            tickle(): Promise<HMfullResults>
            nosebleed(): Promise<HMfullResults>
            threaten(): Promise<HMfullResults>
            depression(): Promise<HMfullResults>
            wolf_arts(): Promise<HMfullResults>
            jahy_arts(): Promise<HMfullResults>
            neko_arts(): Promise<HMfullResults>
            coffee_arts(): Promise<HMfullResults>
            wallpaper(): Promise<HMfullResults>
            mobileWallpaper(): Promise<HMfullResults>
        },
        nsfw: {
            anal(): Promise<HMfullResults>
            ass(): Promise<HMfullResults>
            bdsm(): Promise<HMfullResults>
            cum(): Promise<HMfullResults>
            classic(): Promise<HMfullResults>
            creampie(): Promise<HMfullResults>
            manga(): Promise<HMfullResults>
            femdom(): Promise<HMfullResults>
            hentai(): Promise<HMfullResults>
            incest(): Promise<HMfullResults>
            masturbation(): Promise<HMfullResults>
            public(): Promise<HMfullResults>
            ero(): Promise<HMfullResults>
            orgy(): Promise<HMfullResults>
            elves(): Promise<HMfullResults>
            yuri(): Promise<HMfullResults>
            pantsu(): Promise<HMfullResults>
            glasses(): Promise<HMfullResults>
            cuckold(): Promise<HMfullResults>
            blowjob(): Promise<HMfullResults>
            boobjob(): Promise<HMfullResults>
            footjoob(): Promise<HMfullResults>
            handjoob(): Promise<HMfullResults>
            boobs(): Promise<HMfullResults>
            thighs(): Promise<HMfullResults>
            pussy(): Promise<HMfullResults>
            ahegao(): Promise<HMfullResults>
            gangbang(): Promise<HMfullResults>
            tentacles(): Promise<HMfullResults>
            uniform(): Promise<HMfullResults>
            gif(): Promise<HMfullResults>
            nsfwNeko(): Promise<HMfullResults>
            nsfwMobileWallpaper(): Promise<HMfullResults>
            zettaiRyouiki(): Promise<HMfullResults>
        }
    }
    interface HMfullResults { url: string }
}