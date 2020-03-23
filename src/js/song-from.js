{
    let view = {
        el: '.page>main',
        init() {
            this.$el = $(this.el);
        },
        template: `
        <form class="form-horizontal uploadFrom " role="form">
        <div class="form-group">
            <label for="firstname" class="col-sm-1 control-label">歌曲</label>
            <div class="col-sm-2">
                <input type="text" name="name" class="form-control" id="firstname" placeholder="请输入歌曲名字" value="__name__">
            </div>
        </div>
        <div class="form-group">
            <label for="lastname"  class="col-sm-1 control-label">歌手</label>
            <div class="col-sm-2">
                <input type="text" name="singer" class="form-control" id="lastname" placeholder="请输入歌手名字" value="__singer__">
            </div>
        </div>
        <div class="form-group">
            <label for="lastname"  class="col-sm-1 control-label">外链</label>
            <div class="col-sm-2">
                <input type="text" name="url" class="form-control" id="lastname" value="__url__">
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-offset-1 col-sm-2">
                <button type="submit" class="btn btn-default">保存</button>
            </div>
        </div>
    </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'singer', 'url', 'id'];
            let html = this.template;
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '');
            })
            $(this.el).html(html);
        },
        reset() {
            this.render({});
        }
    };
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: ''
        },
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then((newSong) => {
                let { id, attributes } = newSong;
                Object.assign(this.data, { id, ...attributes })
            }, (error) => {
                console.log(error);
            });
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.init();
            this.bindEvents();
            this.view.render(this.model.data);
            window.eventHub.on('upload', (data) => {
                this.view.render(data)
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault();
                let needs = 'name singer url'.split(' ');
                let data = {};
                needs.map((string) => {
                    data[string] = this.view.$el.find(`[name="${string}"]`).val();
                })
                this.model.create(data).then(() => {
                    this.view.reset();
                    let string = JSON.stringify(this.model.data);
                    let object = JSON.parse(string)
                    window.eventHub.emit('create', object);
                })
            })
        }
    };
    controller.init(view, model);
}