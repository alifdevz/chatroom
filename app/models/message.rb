class Message < ApplicationRecord
    after_create_commit { broadcast_message }
  
    private
  
    def broadcast_message
      ActionCable.server.broadcast('MessagesChannel',{ 
                                    id: 1, 
                                    body: "Hi!" }
                                    )
    end
  end
  