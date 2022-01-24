(function(window, $) {
  var alertHtml = '<div class="modal fade" id="alertModel" tabindex="-1" role="dialog" aria-labelledby="alertModelLabel">\
                    <div class="modal-dialog" role="document">\
                        <div class="modal-content m-content">\
                            <div class="m-header clearfix m-sm border-bottom">\
                              <div class="m-close"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>\
                              <div class="m-title"></div>\
                            </div>\
                            <div class="m-body font14 p-sm" style="line-height: 26px;">\
                            </div>\
                            <div class="m-footer text-right m-sm">\
                            </div>\
                        </div>\
                    </div>\
                  </div>';
  function AlertModel(el, options) {
    options.backdrop = 'static';
    options.keyboard = false;
    $.fn.modal.Constructor.call(this, el, options)
    this.type = options.type
    this.tipMsg = options.message;
    this.duration = options.duration;
    this.confirm = options.confirm;
    this.cancel = options.cancel;
    this.confirmText = options.confirmText;
    this.cancelText = options.cancelText;
    this.title = options.title ? options.title : (this.type === 'alert' ? '提示' : '确认');
    this.$alertHeader = this.$element.find('.m-header');
    this.$alertTitle = this.$element.find('.m-title');
    this.$alertFooter = this.$element.find('.m-footer');
    this.$alertBody = this.$element.find('.m-body');
    this.$closeBtn = this.$element.find('.m-close');
  }
  AlertModel.DEFAULT = {
    duration: 1000,
    type: 'alert',
    message: '',
    confirmText: '确定',
    cancelText: '取消',
    confirm: false,
    cancel: false
  }
  AlertModel.prototype = Object.create($.fn.modal.Constructor.prototype)
  AlertModel.prototype.renderHeader = function() { 
    var titleHtml = '<span class="font16 bold">'+this.title+'</span>'
    this.$alertTitle.html(titleHtml)
    if(this.type === 'toast')  {
      this.$alertHeader.hide();
    } else {
      this.$alertHeader.show();
    }
  }
  AlertModel.prototype.renderFooter = function() {
    var btnHtml = ''; // type toast
    if(this.confirm && this.type === 'alert') {
      btnHtml =	'<button class="btn btn-success">'+this.confirmText+'</button>'
    }
    if(this.type === 'confirm') {
      btnHtml = '<button class="btn btn-default btn-cancel" data-dismiss="modal">'+this.cancelText+'</button>\
      <button class="btn btn-success">'+this.confirmText+'</button>'
    }
    this.$alertFooter.html(btnHtml)
  }
  AlertModel.prototype.renderBody = function() {
    this.$alertBody.html(this.tipMsg);
  }
  AlertModel.prototype.bindEvent = function() {
    var self = this
    if(this.confirm) {
      var $confirmBtn = this.$alertFooter.find('.btn-success');
      $confirmBtn.off('click');
      $confirmBtn.on('click', function() {
        self.hide();
        //因为 Modal.TRANSITION_DURATION = 300,需要关闭动画执行
        setTimeout(function() {
          self.confirm()
        }, 500)
      })
    }
    if(this.cancel) {
      var $cancelBtn = this.$alertFooter.find('.btn-cancel');
      $cancelBtn.off('click');
      $cancelBtn.on('click', function() {
        setTimeout(function() {
          self.cancel()
        }, 500)
      })
    }
  }
  AlertModel.prototype.showModal = function() {
    var self = this
    this.show()
    if(!this.confirm) {
      window.modalTimer = setTimeout(function() {
        self.hide()
      },this.duration)
    }
  }
  AlertModel.prototype.init = function() {
    this.renderHeader();
    this.renderFooter();
    this.renderBody();
    this.bindEvent();
    this.showModal()
  }

  function initModal() {
    var modalTypes = ['alert', 'toast', 'confirm'];
    var modalEl = $("#alertModel");
    modalTypes.forEach(function(type, idx) {
      bsDialog[type] = function(tipMsg, options)  {
        // todo待定 对参数的处理，字符串或对象的区分
        var newOptions = $.extend({}, AlertModel.DEFAULT, {message: tipMsg, type: type}, options);
        var alertModel = new AlertModel(modalEl, newOptions)
        alertModel.init()
      };
    })
  }
  function init() {
    $('body').append(alertHtml);
    initModal();
  }
  var bsDialog = Object.create(null);
  bsDialog.init = init;
  bsDialog.init()
  window.bsDialog = bsDialog;
})(window, $)