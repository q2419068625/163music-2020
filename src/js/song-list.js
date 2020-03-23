{
    let view = {
        el: '#songList-container',
        template: `
            <ul class="list-group songList">
            </ul>
        `,
        render(data) {
            let $el = $(this.el);
            $el.html(this.template);
            let { songs } = data;
            let liList = songs.map((song) => $('<li></li>').text(song.name).addClass('list-group-item'))
            $el.find('ul').empty();
            console.log($el.find('ul'));
            liList.map((domLi) => {
                $el.find('ul').append(domLi);
            })
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    };
    let model = {
        data: {
            songs: []
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            window.eventHub.on('upload', () => {
                this.view.clearActive();
            });
            window.eventHub.on('create', (songData) => {
                console.log(1);
                this.model.data.songs.push(songData);
                console.log(2);
                this.view.render(this.model.data);
                console.log(3);

            })
        }
    };
    controller.init(view, model);
}