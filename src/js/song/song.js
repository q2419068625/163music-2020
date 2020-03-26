{
    let view = {
        el: '#song',
        render(data) {
            let { song, status } = data;
            $(this.el).css('background-image', `url(${song.cover})`)
            $(this.el).find('img.cover').attr('src', song.cover)
            $(this.el).find('.song-description>h1').text(song.name)
            if ($(this.el).find('audio').attr('src') !== song.url) {
                $(this.el).find('audio').attr('src', song.url)
            }

            if (status === 'playing') {
                $(this.el).find('.disc-container').addClass('playing')
            } else {
                $(this.el).find('.disc-container').removeClass('playing')

            }
        },
        play() {
            $(this.el).find('audio')[0].play();

        },
        pause() {
            $(this.el).find('audio')[0].pause();
        }
    }
    let model = {
        data: {
            song: {
                id: '',
                name: '',
                singer: '',
                url: ''
            },
            status: 'paused'
        },
        get(id) {
            var query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(this.data.song, { id: song.id, ...song.attributes });
                return song
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            let id = this.getSongID();
            this.model.get(id).then((data) => {
                this.view.render(this.model.data);
            });
            this.bindEvents();
        },
        bindEvents() {
            $(this.view.el).on('click', '.icon-play', () => {
                this.model.data.status = 'playing';
                this.view.render(this.model.data);
                this.view.play()
            })
            $(this.view.el).on('click', '.icon-pause', () => {
                this.model.data.status = 'paused';
                this.view.render(this.model.data);
                this.view.pause()
            })
        },
        getSongID() {
            let search = window.location.search;
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }
            let array = search.split('&').filter((v => v));
            let id = '';
            for (let i = 0; i < array.length; i++) {
                let kv = array[i].split('=');
                let key = kv[0];
                let value = kv[1];
                if (key === 'id') {
                    id = value;
                    break;
                }
            }
            return id;
        }

    }
    controller.init(view, model)
}