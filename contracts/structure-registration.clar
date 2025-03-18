;; Structure Registration Contract
;; Records details of historically significant buildings

(define-data-var admin principal tx-sender)

;; Map of authorized registrars
(define-map authorized-registrars
  { registrar-id: principal }
  {
    name: (string-ascii 64),
    organization: (string-ascii 64),
    authorization-date: uint,
    status: (string-ascii 16)
  }
)

;; Map of building records
(define-map buildings
  { building-id: (string-ascii 32) }
  {
    name: (string-ascii 64),
    address: (string-ascii 256),
    construction-year: uint,
    architect: (string-ascii 64),
    architectural-style: (string-ascii 64),
    registration-date: uint,
    last-updated: uint,
    registered-by: principal,
    status: (string-ascii 16)
  }
)

;; Map of building ownership
(define-map building-ownership
  { building-id: (string-ascii 32) }
  {
    owner-name: (string-ascii 64),
    owner-type: (string-ascii 32), ;; "private", "public", "non-profit"
    contact-info: (string-ascii 256),
    ownership-date: uint,
    verified: bool,
    verified-by: (optional principal),
    verification-date: (optional uint)
  }
)

;; Map of historical designations
(define-map historical-designations
  { building-id: (string-ascii 32), designation-id: (string-ascii 32) }
  {
    designation-type: (string-ascii 32), ;; "national", "state", "local"
    designating-authority: (string-ascii 64),
    designation-date: uint,
    criteria: (string-ascii 256),
    documentation-hash: (buff 32),
    status: (string-ascii 16)
  }
)

;; Map of building features
(define-map building-features
  { building-id: (string-ascii 32), feature-id: (string-ascii 32) }
  {
    feature-type: (string-ascii 32),
    description: (string-ascii 256),
    historical-significance: (string-ascii 256),
    documentation-hash: (buff 32),
    added-by: principal,
    added-at: uint
  }
)

;; Map of building modifications history
(define-map building-modifications
  { building-id: (string-ascii 32), modification-id: uint }
  {
    modification-type: (string-ascii 32),
    description: (string-ascii 256),
    date: uint,
    performed-by: (string-ascii 64),
    documentation-hash: (buff 32),
    recorded-by: principal,
    recorded-at: uint
  }
)

;; Counter for building modifications
(define-data-var modification-counter uint u0)

;; Register a registrar
(define-public (register-registrar
  (registrar-id principal)
  (name (string-ascii 64))
  (organization (string-ascii 64)))
  (let ((current-time (default-to u0 (get-block-info? time u0))))
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))

    (map-insert authorized-registrars
      { registrar-id: registrar-id }
      {
        name: name,
        organization: organization,
        authorization-date: current-time,
        status: "active"
      }
    )

    (ok true)
  )
)

;; Register a building
(define-public (register-building
  (building-id (string-ascii 32))
  (name (string-ascii 64))
  (address (string-ascii 256))
  (construction-year uint)
  (architect (string-ascii 64))
  (architectural-style (string-ascii 64)))
  (let ((current-time (default-to u0 (get-block-info? time u0))))
    (asserts! (is-authorized-registrar tx-sender) (err u403))
    (asserts! (not (is-some (map-get? buildings { building-id: building-id }))) (err u400))

    (map-insert buildings
      { building-id: building-id }
      {
        name: name,
        address: address,
        construction-year: construction-year,
        architect: architect,
        architectural-style: architectural-style,
        registration-date: current-time,
        last-updated: current-time,
        registered-by: tx-sender,
        status: "active"
      }
    )

    (ok true)
  )
)

;; Register building ownership
(define-public (register-ownership
  (building-id (string-ascii 32))
  (owner-name (string-ascii 64))
  (owner-type (string-ascii 32))
  (contact-info (string-ascii 256))
  (ownership-date uint))
  (let ((building (unwrap! (map-get? buildings { building-id: building-id }) (err u404))))
    (asserts! (is-authorized-registrar tx-sender) (err u403))

    (map-insert building-ownership
      { building-id: building-id }
      {
        owner-name: owner-name,
        owner-type: owner-type,
        contact-info: contact-info,
        ownership-date: ownership-date,
        verified: false,
        verified-by: none,
        verification-date: none
      }
    )

    (ok true)
  )
)

;; Verify building ownership
(define-public (verify-ownership
  (building-id (string-ascii 32)))
  (let ((ownership (unwrap! (map-get? building-ownership { building-id: building-id }) (err u404)))
        (current-time (default-to u0 (get-block-info? time u0))))
    (asserts! (is-authorized-registrar tx-sender) (err u403))

    (map-set building-ownership
      { building-id: building-id }
      (merge ownership {
        verified: true,
        verified-by: (some tx-sender),
        verification-date: (some current-time)
      })
    )

    (ok true)
  )
)

;; Add historical designation
(define-public (add-designation
  (building-id (string-ascii 32))
  (designation-id (string-ascii 32))
  (designation-type (string-ascii 32))
  (designating-authority (string-ascii 64))
  (designation-date uint)
  (criteria (string-ascii 256))
  (documentation-hash (buff 32)))
  (let ((building (unwrap! (map-get? buildings { building-id: building-id }) (err u404))))
    (asserts! (is-authorized-registrar tx-sender) (err u403))

    (map-insert historical-designations
      { building-id: building-id, designation-id: designation-id }
      {
        designation-type: designation-type,
        designating-authority: designating-authority,
        designation-date: designation-date,
        criteria: criteria,
        documentation-hash: documentation-hash,
        status: "active"
      }
    )

    (ok true)
  )
)

;; Add building feature
(define-public (add-feature
  (building-id (string-ascii 32))
  (feature-id (string-ascii 32))
  (feature-type (string-ascii 32))
  (description (string-ascii 256))
  (historical-significance (string-ascii 256))
  (documentation-hash (buff 32)))
  (let ((building (unwrap! (map-get? buildings { building-id: building-id }) (err u404)))
        (current-time (default-to u0 (get-block-info? time u0))))
    (asserts! (is-authorized-registrar tx-sender) (err u403))

    (map-insert building-features
      { building-id: building-id, feature-id: feature-id }
      {
        feature-type: feature-type,
        description: description,
        historical-significance: historical-significance,
        documentation-hash: documentation-hash,
        added-by: tx-sender,
        added-at: current-time
      }
    )

    (ok true)
  )
)

;; Record building modification
(define-public (record-modification
  (building-id (string-ascii 32))
  (modification-type (string-ascii 32))
  (description (string-ascii 256))
  (date uint)
  (performed-by (string-ascii 64))
  (documentation-hash (buff 32)))
  (let ((building (unwrap! (map-get? buildings { building-id: building-id }) (err u404)))
        (current-time (default-to u0 (get-block-info? time u0)))
        (modification-id (var-get modification-counter)))
    (asserts! (is-authorized-registrar tx-sender) (err u403))

    (var-set modification-counter (+ modification-id u1))

    (map-insert building-modifications
      { building-id: building-id, modification-id: modification-id }
      {
        modification-type: modification-type,
        description: description,
        date: date,
        performed-by: performed-by,
        documentation-hash: documentation-hash,
        recorded-by: tx-sender,
        recorded-at: current-time
      }
    )

    (ok modification-id)
  )
)

;; Update building status
(define-public (update-building-status
  (building-id (string-ascii 32))
  (status (string-ascii 16)))
  (let ((building (unwrap! (map-get? buildings { building-id: building-id }) (err u404)))
        (current-time (default-to u0 (get-block-info? time u0))))
    (asserts! (is-authorized-registrar tx-sender) (err u403))

    (map-set buildings
      { building-id: building-id }
      (merge building {
        status: status,
        last-updated: current-time
      })
    )

    (ok true)
  )
)

;; Check if a principal is an authorized registrar
(define-private (is-authorized-registrar (registrar principal))
  (let ((registrar-info (map-get? authorized-registrars { registrar-id: registrar })))
    (if (is-some registrar-info)
      (is-eq (get status (unwrap-panic registrar-info)) "active")
      false
    )
  )
)

;; Get building information
(define-read-only (get-building (building-id (string-ascii 32)))
  (map-get? buildings { building-id: building-id })
)

;; Get building ownership
(define-read-only (get-building-ownership (building-id (string-ascii 32)))
  (map-get? building-ownership { building-id: building-id })
)

;; Get historical designation
(define-read-only (get-historical-designation (building-id (string-ascii 32)) (designation-id (string-ascii 32)))
  (map-get? historical-designations { building-id: building-id, designation-id: designation-id })
)

;; Get building feature
(define-read-only (get-building-feature (building-id (string-ascii 32)) (feature-id (string-ascii 32)))
  (map-get? building-features { building-id: building-id, feature-id: feature-id })
)

;; Get building modification
(define-read-only (get-building-modification (building-id (string-ascii 32)) (modification-id uint))
  (map-get? building-modifications { building-id: building-id, modification-id: modification-id })
)

;; Transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (var-set admin new-admin)
    (ok true)
  )
)
