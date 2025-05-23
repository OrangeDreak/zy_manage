export default {
  header: {
    search: 'Search products',
    searchButton: 'Search',
    nav: {
      freightEstimate: 'Freight Estimate',
      transfer: 'Transfer',
      help: 'Help Center'
    },
    user: {
      profile: 'Profile',
      logout: 'Logout'
    }
  },
  menu: {
    myAccount: 'My Account',
    transferOrder: 'Orders List',
    warehouse: 'My Warehouse',
    package: 'Packages List',
    assets: 'My Assets',
    addTransfer: 'Add Transfer',
    dashboard: 'Dashboard',
    settings: 'Settings',
    help: 'Help Center',
    notification: 'Notifications',
    dict: 'System Dict',
    logisticsList: 'Logistics Line',
    userList: 'User List',
    exchange: 'Exchange Rate',
    recharge: 'Balance Recharge',
    ticket: 'Ticket List',
    article: 'Article List'
  },
  global_cancel: "Cancel",
  gloabl_confirm: "Confirm",
  assets: {
    balance: {
      title: 'Available Balance (USD)',
      frozen: 'Frozen Amount',
      withdraw: 'Withdraw',
      recharge: 'Recharge',
      help: 'View Help'
    },
    transaction: {
      dateRange: {
        start: 'Start Date',
        end: 'End Date'
      },
      viewStatement: 'View Statement',
      table: {
        time: 'Time',
        type: 'Type',
        amount: 'Amount',
        balance: 'Balance',
        details: {
          orderNo: 'Order No',
          description: 'Description',
          paymentMethod: 'Payment Method',
          transactionNo: 'Transaction No'
        }
      }
    }
  },
  // ... 其他页面的翻译
  warehouse: {
    title: 'My Warehouse',
    table: {
      productInfo: 'Product Info',
      weight: 'Weight(g)',
      size: 'Size(cm)',
      quantity: 'Quantity',
      actions: 'Actions',
      details: 'Details'
    },
    product: {
      color: 'Color',
      size: 'Size'
    },
    bottomBar: {
      selectAll: 'Select All',
      selected: 'Selected',
      items: 'items',
      submit: 'Submit Transfer'
    }
  },
  package: {
    title: 'My Packages',
    status: {
      all: 'All',
      pending: 'Pending',
      inStock: 'In Stock',
      shipping: 'Shipping',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    },
    search: {
      placeholder: 'Order No.',
      button: 'Search'
    },
    table: {
      packageInfo: 'Package Info',
      packageNo: 'Package No.',
      submitTime: 'Submit Time',
      images: 'images',
      weight: 'Weight(g)',
      size: 'Size(cm)',
      status: 'Status',
      actions: 'Actions'
    }
  },
  transfer: {
    addOrder: {
      title: 'Add Transfer Order',
      backToList: 'Back to Orders',
      warehouse: {
        title: 'QC elf Warehouse Address',
        getAddress: 'Contact customer service for warehouse address',
        tip: 'Note: When sending to QC elf warehouse, please do not sign for express delivery on the spot, and the express number must correspond to the package one by one.'
      },
      form: {
        customCode: 'Custom Code',
        recentAddress: 'Recent Address',
        addAddress: 'Add Address',
        expressNo: 'Express No.',
        value: 'Item Value(CNY)',
        photo: 'Item Photo',
        addExpress: 'Add Express No.',
        submit: 'Submit Transfer Order'
      }
    },
    submitTransfer: {
      steps: {
        selectProducts: 'Select Products',
        confirmInfo: 'Confirm Info',
        submitOrder: 'Submit Order'
      },
      productList: 'Product List',
      delivery: {
        title: 'Delivery Address',
        addNew: 'Add New Address'
      },
      shipping: {
        title: 'Shipping Method',
        standard: 'Standard',
        express: 'Express',
        economy: 'Economy'
      },
      packaging: {
        title: 'Packaging Service',
        none: 'No Additional Packaging',
        standard: 'Standard Packaging',
        gift: 'Gift Packaging'
      },
      summary: {
        subtotal: 'Subtotal',
        shipping: 'Shipping Fee',
        packaging: 'Packaging Fee',
        total: 'Total'
      }
    },
    list: {
      search: {
        customerCode: 'Customer Code',
        orderNo: 'Order No.',
        tag: 'Order Tag',
        status: 'Order Status',
        placeholder: {
          customerCode: 'Enter customer code',
          orderNo: 'Enter order number',
          tag: 'Please select',
          status: 'Please select'
        },
        reset: 'Reset',
        search: 'Search'
      },
      table: {
        productDetails: 'Product Details',
        customerCode: 'Customer Code',
        orderNo: 'Order No.',
        copy: 'Copy',
        recipientInfo: {
          name: 'Name',
          address: 'Address',
          zipCode: 'ZIP Code',
          phone: 'Phone',
          email: 'Email',
          country: 'Country'
        },
        productRemark: 'Product Remarks',
        editRemark: 'Edit Remarks',
        noRemark: 'No remarks',
        weightSize: 'Weight(g)/Size(cm)',
        orderStatus: 'Order Status',
        logisticsStatus: 'Logistics Status',
        trackingNo: 'Tracking No.',
        actions: 'Actions',
        share: 'Share'
      },
      status: {
        pending: 'Pending',
        inStock: 'In Stock',
        shipping: 'Shipping'
      }
    }
  },
  ticket: {
      keywordPlaceholder: 'Please enter title keywords',
      statusPlaceholder: 'Please select the ticket status',
      add: 'Add Ticket',
      statusItem: {
           submitted: 'Submitted',
           processing: 'Processing',
           completed: 'Completed'
      },
      title: 'Ticket Title',
      status: 'Ticket Status',
      view: 'View',
      msgTip: 'New message received',
      ticketForm: {
         title: 'Add Ticket',
         titleLabel: 'Ticket Title',
         contentLabel: 'Issue Description',
         titlePlaceholder: 'Please enter ticket title',
         contentPlaceholder: 'Please enter issue description'
      },
      ticketDetailForm: {
         title: 'Ticket Detail',
         contentLabel: '',
         contentPlaceholder: 'Please enter reply content',

      }

    }
} 