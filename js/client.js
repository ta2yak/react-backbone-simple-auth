/** @jsx React.DOM */

require(["jquery", "react", "models/session"], function($, React, Session){

  // ログインしていないと表示できないコンテンツ
  var SignedContent = React.createClass({
    // ログアウトリンク用の処理
    handleLogoutLink: function(e) {
      var session = this.props.session;
      session.logout({});
      return;
    },
    render: function() {
      return (
        <div className="authorized">
          <h1>ログイン成功</h1>
          <p>{this.props.session.user.get("name")}</p>
          <input type="button" value="Log out" onClick={this.handleLogoutLink} />
        </div>
      );
    }
  });

  // 新規登録フォーム
  var SignupForm = React.createClass({
    handleSignup: function(e) {
      e.preventDefault();
      var username = this.refs.username.getDOMNode().value.trim();
      var name = this.refs.name.getDOMNode().value.trim();
      var password = this.refs.password.getDOMNode().value.trim();
      if (!password || !username || !name) {
        return;
      }

      // 新規登録を行うので改めてセッションモデルを作成する
      var session = new Session();
      session.signup({username: username, name: name, password: password}, {
          success: function() {
            // 新規登録が完了したら新しいセッションモデルを使用して認証済みコンテンツを再表示する
            React.renderComponent(
              <AuthorizedContainer session={session} />,
              document.getElementById('content')
            );
          }.bind(this),
          error: function(mod, res){
            console.error(res);
          }.bind(this)
      });

      this.refs.username.getDOMNode().value = '';
      this.refs.name.getDOMNode().value = '';
      this.refs.password.getDOMNode().value = '';
      return;
    },
    handleBackLink: function(e) {
      var session = new Session();
      React.renderComponent(
        <AuthorizedContainer session={session} />,
        document.getElementById('content')
      );
      return;
    },
    render: function() {
      return (

          <div className="row">
              <div className="col-sm-6 col-md-4 col-md-offset-4">
                  <h1 className="text-center signup-title">Welcome to Sample App</h1>
                  <div className="account-wall">
                      <img className="profile-img" src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                          alt="" />
                      <form className="signup-form" onSubmit={this.handleSignup}>
                        <input type="text" className="form-control" placeholder="UserName" required autofocus ref="username" />
                        <input type="text" className="form-control" placeholder="ScreenName" required ref="name" />
                        <input type="password" className="form-control" placeholder="Password" required ref="password" />
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Register</button>
                      </form>
                  </div>
                  <a href="#" className="text-center new-account" onClick={this.handleBackLink}>Back</a>
              </div>
          </div>

      );
    }
  });


  // 要認証コンテンツ用コンテナ
  var AuthorizedContainer = React.createClass({
    // コンテンツの表示前にユーザ情報を取得する
    fetchUser: function() {

      var session = this.props.session;
        session.checkAuth({
          success: function() {
            // セッション情報に変更があれば componentDidMount 時に設定した forceUpdate　が実行される
          }.bind(this),
          error: function(mod, res){
            console.error(res);
            }.bind(this)
        });

    },
    handleLogin: function(e) {
      e.preventDefault();
      var username = this.refs.username.getDOMNode().value.trim();
      var password = this.refs.password.getDOMNode().value.trim();
      if (!password || !username) {
        return;
      }

      var session = this.props.session;
      session.login({username: username, password: password}, {
          success: function() {
          }.bind(this),
          error: function(mod, res){
            console.log("session.login fail");
          }.bind(this)
      });

      this.refs.username.getDOMNode().value = '';
      this.refs.password.getDOMNode().value = '';
      return;
    },
    handleSignUpLink: function(e) {
      React.renderComponent(
        <SignupForm session={this.props.session} />,
        document.getElementById('content')
      );
      return;
    },
    componentDidMount: function() {
      // このコンテナはセッションモデルを監視し変更があれば再描画する
      this.props.session.on('change', function() {
        this.forceUpdate();
      }.bind(this));

      this.fetchUser();
    },
    render: function() {
      if (this.props.session.get("logged_in")) {
        return (
          <SignedContent session={this.props.session} />
        );
      }else{
        return (

          <div className="row">
              <div className="col-sm-6 col-md-4 col-md-offset-4">
                  <h1 className="text-center login-title">Sign in to Sample App</h1>
                  <div className="account-wall">
                      <img className="profile-img" src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                          alt="" />
                      <form className="login-form" onSubmit={this.handleLogin}>
                        <input type="text" className="form-control" placeholder="UserName" required autofocus ref="username" />
                        <input type="password" className="form-control" placeholder="Password" required ref="password" />
                        <button className="btn btn-lg btn-primary btn-block" type="submit">
                            Sign in</button>
                      </form>
                  </div>
                  <a href="#" className="text-center new-account" onClick={this.handleSignUpLink}>Create an account </a>
              </div>
          </div>

        );
      }
    }
  });

  // 画面表示
  var session = new Session();  // 最初に使用するセッションモデルを生成する
  React.renderComponent(
    <AuthorizedContainer session={session} />,
    document.getElementById('content')
  );

});
